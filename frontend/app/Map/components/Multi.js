"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DOMParser } from "xmldom";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

// Helper function to convert ABGR color to RGBA
const convertKMLColorToRGBA = (kmlColor) => {
  if (!kmlColor || kmlColor.length !== 8) return "rgba(0, 0, 0, 1)"; // Default to black if invalid
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
  const [uniqueColors, setUniqueColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  // Helper function to create custom icons
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="width: 15px; height: 15px; background-color: ${color}; border-radius: 50%;"></div>`,
      iconSize: [15, 15],
      iconAnchor: [7.5, 7.5],
      popupAnchor: [0, -7.5],
    });
  };

  // Fetch KML files
  useEffect(() => {
    console.log("selectedColors:", selectedColors);
    const fetchKMLFiles = async () => {
      setLoading(true); // Start loading

      try {
        const response = await fetch(url, {
          headers: { "Content-Type": "application/xml; charset=UTF-8" },
        });

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

        Array.from(styleElements).forEach((style) => {
          const styleId = style.getAttribute("id");
          const color = style.getElementsByTagName("color")[0]?.textContent || null;

          if (color) {
            styles[`#${styleId}`] = { color: convertKMLColorToRGBA(color) };
          }
        });

        const geoJsonFeatures = [];
        const colors = new Set();

        Array.from(placemarks).forEach((placemark) => {
          const nameElement = placemark.getElementsByTagName("name");
          const name = nameElement.length ? nameElement[0]?.textContent : "Unnamed";

          const descriptionElement = placemark.getElementsByTagName("description");
          const description = descriptionElement.length
            ? descriptionElement[0]?.textContent
            : "No additional details available.";

          const point = placemark.getElementsByTagName("Point");
          if (point.length === 0) return;

          const coordinatesString = point[0]?.getElementsByTagName("coordinates")[0]?.textContent || "";
          if (!coordinatesString) return;

          const [lon, lat, alt] = coordinatesString.trim().split(",").map(Number);

          const styleUrl = placemark.getElementsByTagName("styleUrl")[0]?.textContent || "";
          const styleData = styles[styleUrl] || {};
          const color = styleData.color;

          geoJsonFeatures.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lon, lat, alt],
            },
            properties: {
              name,
              description,
              color,
            },
          });

          colors.add(color);
        });

        if (geoJsonFeatures.length > 0) {
          setGeoJsonData(geoJsonFeatures);
          setFirstCoordinates(geoJsonFeatures[0]?.geometry?.coordinates);
          setUniqueColors(Array.from(colors));
        }
      } catch (error) {
        setError("An error occurred while fetching the KML file.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchKMLFiles();
  }, [url, selectedColors]);

  const handleColorSelection = (color, isSelected) => {
    console.log("isSelected:", isSelected);
    console.log("color:", color);
    setSelectedColors((prev) =>
      isSelected ? [...prev, color] : prev.filter((c) => c !== color)
    );
  };

  return error ? (
    <div className="p-4 text-red-600">{error}</div>
  ) : loading ? ( // Show loading message until data is fetched
    <div className="text-center text-lg font-semibold p-6">Loading Map...</div>
  ) : firstCoordinates ? (
    <>
      <div className="w-[30vw] p-4 bg-gray-50 border-t border-gray-200">
        <h3 className="text-xl font-semibold">Colors Used:</h3>
        <ul className="list-none p-0">
          {uniqueColors.map((color, index) => (
            <li key={index} className="mb-2 flex items-center text-black">
              <input
                type="checkbox"
                className="mr-3"
                checked={selectedColors.includes(color)}
                onChange={(e) => handleColorSelection(color, e.target.checked)}
              />
              <span className="inline-block w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }}></span>
              {color}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-gray-600">Selected Colors: {selectedColors.join(", ") || "None"}</p>
      </div>

      <MapContainer center={[firstCoordinates[1], firstCoordinates[0]]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {geoJsonData
          .filter((feature) => selectedColors.includes(feature.properties.color))
          .map((feature, index) => {
            const color = feature.properties.color;
            const description = feature.properties.description || "No additional details available.";
            return (
              color && (
                <GeoJSON
                  key={index}
                  data={feature}
                  pointToLayer={(feature, latlng) => {
                    const icon = createCustomIcon(color);
                    if (!icon) return null;
                    return L.marker(latlng, { icon }).bindPopup(`
                      <div style="max-height: 150px; overflow-y: auto; padding-right: 5px;">
                        <b>${feature.properties.name}</b><br>
                        ${description}<br>
                        <span style="display: inline-block; margin-top: 5px;">Color: ${feature.properties.color}</span>
                      </div>
                    `);
                  }}
                />
              )
            );
          })}
      </MapContainer>
    </>
  ) : (
    <div className="text-center text-lg font-semibold p-6">Loading Map...</div>
  );
};

export default Home;
