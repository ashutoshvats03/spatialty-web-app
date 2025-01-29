"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { DOMParser } from "xmldom";
import { FaLocationDot } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

// Convert the FaLocationDot icon to an HTML string
const customPointerIcon = L.divIcon({
  className: "custom-pointer-icon",
  html: `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 15px;
      height: 15px;
      background-color: transparent;
      position: relative;
    ">
      ${ReactDOMServer.renderToStaticMarkup(<FaLocationDot color="red" size="24px" />)}
    </div>
  `,
  iconSize: [30, 30], // Adjust size as needed
  iconAnchor: [15, 30], // Adjust anchor point
  popupAnchor: [0, -30],
});

const Home = ({ url }) => {
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [firstCoordinates, setFirstCoordinates] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKMLFiles = async () => {
      try {
        const response = await fetch(url, {
          headers: { "Content-Type": "application/xml; charset=UTF-8" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch KML file.");
        }

        const kmlText = await response.text();
        const kmlDom = new DOMParser().parseFromString(kmlText, "application/xml");

        if (!kmlDom || kmlDom.getElementsByTagName("parsererror").length) {
          console.error("Invalid KML or parsing error");
          setError("Invalid KML or parsing error.");
          return;
        }

        const placemarks = kmlDom.getElementsByTagName("Placemark");
        if (placemarks.length === 0) {
          console.warn("No Placemark elements found in the KML");
          return;
        }

        const geoJsonFeatures = Array.from(placemarks)
          .map((placemark) => {
            const nameElement = placemark.getElementsByTagName("name");
            const name = nameElement.length ? nameElement[0]?.textContent : "Unnamed";

            const point = placemark.getElementsByTagName("Point");
            if (point.length === 0) return null;

            const coordinatesString = point[0]?.getElementsByTagName("coordinates")[0]?.textContent || "";
            if (!coordinatesString) return null;

            const [lon, lat, alt] = coordinatesString.trim().split(",").map(Number);

            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lon, lat, alt],
              },
              properties: { name },
            };
          })
          .filter((feature) => feature !== null);

        if (geoJsonFeatures.length > 0) {
          setGeoJsonData(geoJsonFeatures);
          setFirstCoordinates(geoJsonFeatures[0]?.geometry?.coordinates);
        }
      } catch (error) {
        console.error("Error fetching KML files:", error);
        setError("An error occurred while fetching the KML file. Please check your internet connection.");
      }
    };

    fetchKMLFiles();
  }, [url]);

  return error ? (
    <div className="error-message">{error}</div>
  ) : firstCoordinates ? (
    <MapContainer
      center={[firstCoordinates[1], firstCoordinates[0]]}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {geoJsonData.map((feature, index) => (
        <GeoJSON
          key={index}
          data={feature}
          pointToLayer={(feature, latlng) => {
            return L.marker(latlng, { icon: customPointerIcon });
          }}
        />
      ))}
    </MapContainer>
  ) : (
    <div>Loading...</div>
  );
};

export default Home;
