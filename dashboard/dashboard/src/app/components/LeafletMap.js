"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

// Use 'markers' as the prop!
export default function LeafletMap({ markers = [] }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  // Create the Leaflet map on mount
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    leafletMap.current = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(leafletMap.current);
  }, []);

  // Add or update markers when the list changes
  useEffect(() => {
    if (!leafletMap.current) return;

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Defensive: Always use array
    (Array.isArray(markers) ? markers : []).forEach(report => {
      if (report.lat && report.lng) {
        const marker = L.marker([report.lat, report.lng], { icon: defaultIcon });

        const popupContent = `
          <div style="font-weight:bold;">${report.location || "Unknown Location"}</div>
          <div>${report.violationType || report.reason || ""}</div>
          <div>${report.date || ""}</div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(leafletMap.current);
        markersRef.current.push(marker);
      }
    });
  }, [markers]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "300px", minHeight: "250px", borderRadius: "12px" }}
    />
  );
}
