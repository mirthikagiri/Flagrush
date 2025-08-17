"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let icon = undefined;
if (typeof window !== "undefined") {
  const L = require("leaflet");
  icon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export default function MapComponent({ coords, cityName }) {
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
      {icon && (
        <Marker position={coords} icon={icon}>
          <Popup>{cityName ? `${cityName} (Flagged Billboard Example)` : "Flagged Billboard Example"}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
