"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { DOMParser } from "xmldom";

// Import Leaflet only in the browser
let L;
if (typeof window !== "undefined") {
  import("leaflet").then((leaflet) => {
    L = leaflet;
  });
}

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

// Convert ABGR color to RGBA
const convertKMLColorToRGBA = (kmlColor) => {
  if (!kmlColor || kmlColor.length !== 8) return "rgba(0, 0, 0, 1)";
  const alpha = parseInt(kmlColor.slice(0, 2), 16) / 255;
  const blue = parseInt(kmlColor.slice(2, 4), 16);
  const green = parseInt(kmlColor.slice(4, 6), 16);
  const red = parseInt(kmlColor.slice(6, 8), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const Home = ({ url }) => {
  const [geoJsonData, setGeoJsonData] = useState([]);
  const [firstCoordinates, setFirstCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapKey, setMapKey] = useState(0); // Force remount of MapContainer

  useEffect(() => {
    const fetchKMLFiles = async () => {
      setLoading(true);

      try {
        const response = await fetch(url, { headers: { "Content-Type": "application/xml; charset=UTF-8" } });
        if (!response.ok) throw new Error("Failed to fetch KML file.");

        const kmlText = await response.text();
        const kmlDom = new DOMParser().parseFromString(kmlText, "application/xml");

        if (!kmlDom || kmlDom.getElementsByTagName("parsererror").length) {
          setError("Invalid KML or parsing error.");
          setLoading(false);
          return;
        }

        const placemarks = kmlDom.getElementsByTagName("Placemark");
        const styles = {};
        const styleElements = kmlDom.getElementsByTagName("Style");

        // Parse styles and IconStyles
        Array.from(styleElements).forEach((style) => {
          const styleId = style.getAttribute("id");
          const color = style.getElementsByTagName("IconStyle")[0]?.getElementsByTagName("color")[0]?.textContent || null;
          if (color) styles[`#${styleId}`] = { color: convertKMLColorToRGBA(color) };
        });

        const geoJsonFeatures = [];
        const colors = new Set();

        // Parse Placemarks
        Array.from(placemarks).forEach((placemark) => {
          const name = placemark.getElementsByTagName("name")[0]?.textContent || "Unnamed";
          const description = placemark.getElementsByTagName("description")[0]?.textContent || "No details.";
          const point = placemark.getElementsByTagName("Point");

          if (point.length === 0) return;
          const coordinatesString = point[0]?.getElementsByTagName("coordinates")[0]?.textContent || "";
          if (!coordinatesString) return;

          const [lon, lat, alt] = coordinatesString.trim().split(",").map(Number);
          const styleUrl = placemark.getElementsByTagName("styleUrl")[0]?.textContent || "";
          const color = styles[styleUrl]?.color || "rgba(0, 0, 0, 1)";

          geoJsonFeatures.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [lon, lat, alt] },
            properties: { name, description, color },
          });

          colors.add(color);
        });

        if (geoJsonFeatures.length > 0) {
          setGeoJsonData(geoJsonFeatures);
          setFirstCoordinates(geoJsonFeatures[0]?.geometry?.coordinates);


          setTimeout(() => setMapKey((prev) => prev + 1), 1000); // 🔹 Update key to force remount
        }
      } catch (error) {
        setError("An error occurred while fetching the KML file.");
      } finally {
        setLoading(false);
      }
    };

    fetchKMLFiles();
  }, [url]);
  



  return error ? (
    <div className="p-4 text-red-600">{error}</div>
  ) : loading ? (
    <div className="p-4 text-gray-600">Loading map...</div>
  ) : (
    <>

      {/* Map Display */}
      {firstCoordinates && geoJsonData.length > 0 && (
        <MapContainer
          key={mapKey} // 🔹 Forces re-mount when data changes
          center={[firstCoordinates[1], firstCoordinates[0]]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {geoJsonData.map((feature, index) => (
            <GeoJSON
              key={index}
              data={feature}
              pointToLayer={(feature, latlng) => {
                const icon = L?.divIcon({
                  className: "custom-icon",
                  html: `<div style="width: 15px; height: 15px; background-color: ${feature.properties.color}; border-radius: 50%;"></div>`,
                  iconSize: [15, 15],
                  iconAnchor: [7.5, 7.5],
                });

                return L?.marker(latlng, { icon }).bindPopup(`
                    <b>${feature.properties.name}</b><br>
                    <div style="overflow: auto; max-height: 100px">${feature.properties.description}</div>
                  `);
              }}
            />
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default Home;
