"use client";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DOMParser } from "xmldom";
import { FaLocationDot } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";
import { useAppSelector } from "@/app/redux/hooks";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

const Home = ({ url, color, pavementType }) => {
  const displayContent = useAppSelector((state) => state.displayContent.displayContent);

  const [geoJsonData, setGeoJsonData] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // Key to force map re-render

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
        ${ReactDOMServer.renderToStaticMarkup(<FaLocationDot color={color} size="24px" />)}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  useEffect(() => {
    const fetchKMLData = async () => {
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
          setError("Invalid KML or parsing error.");
          return;
        }

        const placemarks = kmlDom.getElementsByTagName("Placemark");
        if (placemarks.length === 0) {
          setError("No valid data found in the KML file.");
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
          const firstCoordinates = geoJsonFeatures[0]?.geometry?.coordinates;
          setMapCenter([firstCoordinates[1], firstCoordinates[0]]);
        }
      } catch (err) {
        setError("An error occurred while loading the map.");
        console.error(err);
      }
    };

    fetchKMLData();
  }, [url, displayContent]); // Fetch data when `url` or `displayContent` changes

  // Reload map when `displayContent` changes
  useEffect(() => {
    setReloadKey((prevKey) => prevKey + 1);
  }, [displayContent]);

  return error ? (
    <div className="error-message">{error}</div>
  ) : (
    <Suspense fallback={<div>Loading map...</div>}>
      {mapCenter ? (
        <div className="w-[40%]">
          {pavementType}
          <MapContainer
            key={reloadKey} // Use reloadKey to force re-render
            center={mapCenter}
            zoom={16}
            style={{ height: "300px", width: "100%" }}
            className="rounded-lg border"
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
        </div>
      ) : (
        <div>Loading map...</div>
      )}
    </Suspense>
  );
};

export default Home;
