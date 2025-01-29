"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { DOMParser } from "xmldom";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

const Home = ({ url }) => {
    const [geoJsonData, setGeoJsonData] = useState([]);
    const [firstCoordinates, setFirstCoordinates] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKMLFiles = async () => {
            try {
                const response = await fetch(url, {
                    headers: { 'Content-Type': 'application/xml; charset=UTF-8' }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch KML file.");
                }

                const kmlText = await response.text();
                console.log("Fetched KML Text:", kmlText);

                const kmlDom = new DOMParser().parseFromString(kmlText, "application/xml");

                if (!kmlDom || kmlDom.getElementsByTagName('parsererror').length) {
                    console.error("Invalid KML or parsing error");
                    setError("Invalid KML or parsing error.");
                    return;
                }

                const placemarks = kmlDom.getElementsByTagName('Placemark');
                if (placemarks.length === 0) {
                    console.warn("No Placemark elements found in the KML");
                    return;
                }

                const geoJsonFeatures = Array.from(placemarks).flatMap(placemark => {
                    const nameElement = placemark.getElementsByTagName('name');
                    const name = nameElement.length ? nameElement[0]?.textContent : "Unnamed";

                    return Array.from(placemark.getElementsByTagName('LineString')).map(lineString => {
                        const coordinatesStringElement = lineString.getElementsByTagName('coordinates');
                        const coordinatesString = coordinatesStringElement.length ? coordinatesStringElement[0]?.textContent : "";

                        if (!coordinatesString) return null;

                        const coordinates = coordinatesString.trim().split(' ').map(coord => {
                            const [lon, lat, alt] = coord.split(',').map(Number);
                            return [lon, lat, alt];
                        });

                        console.log("Coordinates:", coordinates);

                        return {
                            type: "Feature",
                            geometry: { type: "LineString", coordinates },
                            properties: { name }
                        };
                    }).filter(feature => feature !== null);
                });

                console.log("GeoJSON Features:", geoJsonFeatures);
                if (geoJsonFeatures.length > 0) {
                    setGeoJsonData(geoJsonFeatures);
                    setFirstCoordinates(geoJsonFeatures[0]?.geometry?.coordinates[0]);
                }

            } catch (error) {
                console.error("Error fetching KML files:", error);
                setError("An error occurred while fetching the KML file. Please check your internet connection.");
            }
        };

        fetchKMLFiles();
    }, [url]);

    return (
        error ? (
            <div className="error-message">{error}</div>
        ) : firstCoordinates ? (
            <MapContainer center={[firstCoordinates[1], firstCoordinates[0]]} zoom={14} style={{ height: "100vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    retry={10}
                    errorTileUrl="https://via.placeholder.com/256x256?text=No+Tile"
                />
                {geoJsonData.map((feature, index) => (
                    <GeoJSON key={index} data={feature} />
                ))}
            </MapContainer>
        ) : (
            <div>Loading...</div>
        )
    );
};

export default Home;
