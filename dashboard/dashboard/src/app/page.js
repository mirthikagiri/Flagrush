"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import MapComponent
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const CARD_DATA = [
	{
		label: "Total Flagged Billboards",
		value: 123,
		color: "bg-blue-500 text-blue-100",
		accent: "text-blue-600",
	},
	{
		label: "Pending Review",
		value: 45,
		color: "bg-yellow-400 text-yellow-50",
		accent: "text-yellow-600",
	},
	{
		label: "Action Taken",
		value: 67,
		color: "bg-green-500 text-green-100",
		accent: "text-green-600",
	},
];

export default function Home() {
	const [location, setLocation] = useState("");
	const [coords, setCoords] = useState([12.9716, 77.5946]); // Bangalore default
	const [loading, setLoading] = useState(false);

	const handleSearch = async (e) => {
		e.preventDefault();
		if (!location) return;
		setLoading(true);
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
			);
			const data = await res.json();
			if (data && data.length > 0) {
				setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
			}
		} catch (err) {
			// Handle error (optional)
		}
		setLoading(false);
	};

	return (
		<main className="min-h-screen bg-gray-50 px-4 py-8">
			{/* Header */}
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800">FlagRush Dashboard</h1>
			</header>

			{/* Summary Cards */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
				{CARD_DATA.map((card) => (
					<div
						key={card.label}
						className={`rounded-xl shadow-lg p-6 flex flex-col items-center ${card.color} transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl`}
					>
						<span className="text-lg font-medium text-gray-900 mb-2">{card.label}</span>
						<span className={`text-3xl font-bold ${card.accent} drop-shadow-sm`}>{card.value}</span>
					</div>
				))}
			</section>

			{/* Location Search */}
			<section className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center mb-8">
				<form className="w-full max-w-md mb-6 flex gap-2" onSubmit={handleSearch}>
					<input
						type="text"
						placeholder="Search city..."
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
					/>
					<button
						type="submit"
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out"
					>
						{loading ? "Searching..." : "Search"}
					</button>
				</form>
				<h2 className="text-xl font-semibold text-gray-700 mb-4">Billboard Heatmap</h2>
				<div className="w-full h-[400px] max-w-3xl mx-auto rounded-lg overflow-hidden border border-gray-200">
					<MapComponent coords={coords} />
				</div>
			</section>

			{/* View All Reports Button */}
			<div className="flex justify-center">
				<Link href="/reports">
					<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out">
						View All Reports
					</button>
				</Link>
			</div>
		</main>
	);
}
