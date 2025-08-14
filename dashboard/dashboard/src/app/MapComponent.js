"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon for Leaflet in React
const icon = L.icon({
  iconUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon.png") : "",
  iconRetinaUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-icon-2x.png") : "",
  shadowUrl: typeof window !== "undefined" ? require("leaflet/dist/images/marker-shadow.png") : "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ coords }) {
  return (
    <MapContainer
      center={coords}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={coords} icon={icon}>
        <Popup>Flagged Billboard Example</Popup>
      </Marker>
    </MapContainer>
  );
}
