"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DOMParser } from "xmldom";
import { FaLocationDot } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

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
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Home = ({ urls }) => {
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]); // Default center: India's geographic center
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKMLFiles = async () => {
      try {
        const allGeoJson = [];
        let firstCoordinates = null;

        for (const url of urls) {
          const response = await fetch(url, {
            headers: { "Content-Type": "application/xml; charset=UTF-8" },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch KML file from ${url}.`);
          }

          const kmlText = await response.text();
          const kmlDom = new DOMParser().parseFromString(kmlText, "application/xml");

          if (!kmlDom || kmlDom.getElementsByTagName("parsererror").length) {
            console.error("Invalid KML or parsing error for URL:", url);
            setError("Invalid KML or parsing error.");
            continue;
          }

          const placemarks = kmlDom.getElementsByTagName("Placemark");
          if (placemarks.length === 0) {
            console.warn("No Placemark elements found in the KML for URL:", url);
            continue;
          }

          Array.from(placemarks).forEach((placemark) => {
            const nameElement = placemark.getElementsByTagName("name");
            const name = nameElement.length ? nameElement[0]?.textContent : "Unnamed";

            // Process LineString
            Array.from(placemark.getElementsByTagName("LineString")).forEach((lineString) => {
              const coordinatesStringElement = lineString.getElementsByTagName("coordinates");
              const coordinatesString = coordinatesStringElement.length ? coordinatesStringElement[0]?.textContent : "";

              if (!coordinatesString) return;

              const coordinates = coordinatesString.trim().split(" ").map((coord) => {
                const [lon, lat, alt] = coord.split(",").map(Number);
                return [lon, lat, alt];
              });

              allGeoJson.push({
                type: "Feature",
                geometry: { type: "LineString", coordinates },
                properties: { name },
              });

              if (!firstCoordinates) {
                firstCoordinates = [coordinates[0][1], coordinates[0][0]]; // First LineString point
              }
            });

            // Process Point
            Array.from(placemark.getElementsByTagName("Point")).forEach((point) => {
              const coordinatesString = point?.getElementsByTagName("coordinates")[0]?.textContent || "";
              if (!coordinatesString) return;

              const [lon, lat, alt] = coordinatesString.trim().split(",").map(Number);

              if (!isNaN(lat) && !isNaN(lon)) {
                allGeoJson.push({
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [lon, lat, alt] },
                  properties: { name },
                });

                if (!firstCoordinates) {
                  firstCoordinates = [lat, lon]; // First Point coordinates
                }
              }
            });
          });
        }

        setGeoJsonData(allGeoJson);
        if (firstCoordinates) {
          setMapCenter(firstCoordinates);
        }
      } catch (error) {
        console.error("Error fetching KML files:", error);
        setError("An error occurred while fetching the KML files. Please check your internet connection.");
      }
    };

    fetchKMLFiles();
  }, [urls]);

  return error ? (
    <div className="error-message">{error}</div>
  ) : (
    <MapContainer
      center={mapCenter} // Center dynamically updated
      zoom={7} // Zoom level for India
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
            if (feature.geometry.type === "Point") {
              return L.marker(latlng, { icon: customPointerIcon });
            }
            return null;
          }}
        />
      ))}
    </MapContainer>
  );
};

export default Home;
