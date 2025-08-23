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

export default function LeafletMap({ reports }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

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
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(leafletMap.current);
  }, []);

  useEffect(() => {
    if (!leafletMap.current) return;
    // Remove old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    // Add new markers
    reports.forEach(report => {
      if (report.lat && report.lng) {
        const marker = L.marker([report.lat, report.lng], { icon: defaultIcon });
        let popupContent = `<div style='font-family:Inter,sans-serif;min-width:180px;'>`;
        popupContent += `<div style='font-weight:600;color:#2563eb;'>${report.location}</div>`;
        popupContent += `<div style='color:#374151;font-size:13px;'>${report.violationType}</div>`;
        popupContent += `<div style='margin:4px 0;color:#6b7280;font-size:12px;'>${report.status} &bull; ${report.date}</div>`;
        if (report.imageUrl) {
          popupContent += `<img src='${report.imageUrl}' alt='Billboard' style='width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;margin-top:4px;' />`;
        } else {
          popupContent += `<span style='display:inline-block;width:32px;height:32px;background:#e5e7eb;border-radius:50%;margin-top:4px;'><svg width='24' height='24' fill='none' stroke='#6b7280' stroke-width='2' viewBox='0 0 24 24'><path d='M12 2L15 8H9L12 2ZM12 22V8'/><circle cx='12' cy='16' r='2'/></svg></span>`;
        }
        popupContent += `</div>`;
        marker.bindPopup(popupContent);
        marker.addTo(leafletMap.current);
        markersRef.current.push(marker);
      }
    });
  }, [reports]);

  return (
    <div ref={mapRef} className="w-full h-96 rounded-lg shadow-sm border border-gray-200" />
  );
}
