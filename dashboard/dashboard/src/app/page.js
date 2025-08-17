"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import MapComponent
const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const INDIAN_CITIES = [
	"Bangalore", "Mumbai", "Delhi", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Surat", "Bhopal", "Indore", "Patna", "Chandigarh", "Coimbatore", "Thiruvananthapuram", "Visakhapatnam", "Nagpur", "Vadodara", "Ludhiana", "Agra", "Nashik", "Meerut", "Varanasi", "Ranchi", "Amritsar", "Vijayawada", "Madurai", "Jodhpur", "Raipur", "Guwahati", "Gwalior", "Allahabad", "Aurangabad", "Solapur", "Dehradun", "Jabalpur", "Tiruchirappalli", "Kota", "Bareilly", "Aligarh", "Bhubaneswar", "Moradabad", "Mysore", "Gurgaon", "Noida", "Faridabad", "Ghaziabad", "Dhanbad", "Jamshedpur", "Asansol", "Ajmer", "Udaipur", "Kolhapur", "Akola", "Gulbarga", "Jamnagar", "Bikaner", "Warangal", "Cuttack", "Firozabad", "Nellore", "Bhavnagar", "Bathinda", "Shimla", "Tirupati", "Panipat", "Darbhanga", "Gaya", "Siliguri", "Durgapur", "Muzaffarpur", "Bilaspur", "Mathura", "Chhatarpur", "Rewa", "Satna", "Sagar", "Ratlam", "Hapur", "Shahjahanpur", "Banda", "Etawah", "Farrukhabad", "Rampur", "Baran", "Bharatpur", "Sikar", "Pali", "Beawar", "Churu", "Dausa", "Hanumangarh", "Jhunjhunu", "Sawai Madhopur", "Sirohi", "Tonk", "Bhilwara", "Banswara", "Dewas", "Khandwa", "Burhanpur", "Chhindwara", "Katni", "Seoni", "Balaghat", "Betul", "Hoshangabad", "Mandsaur", "Neemuch", "Shivpuri", "Vidisha", "Guna", "Ashoknagar", "Datia", "Damoh", "Panna", "Sidhi", "Singrauli", "Umaria", "Anuppur", "Dindori", "Mandla", "Narsinghpur", "Sivaganga", "Dindigul", "Karur", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram", "Sivaganga", "Thanjavur", "Theni", "Thoothukudi", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
];
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
	const [cityName, setCityName] = useState("Bangalore");
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	const handleSearch = async (city) => {
		if (!city) return;
		setLoading(true);
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', India')}`
			);
			const data = await res.json();
			if (data && data.length > 0) {
				setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
				setCityName(city);
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
						{/* Only keep the new custom dropdown UI for city selection */}
				<div className="w-full max-w-md mb-6 flex items-center gap-2" style={{ position: 'relative', zIndex: 30 }}>
					<div className="relative w-2/3" style={{ zIndex: 30 }}>
						<input
							type="text"
							placeholder="Search city..."
							value={location}
							onChange={e => {
								setLocation(e.target.value);
								setShowDropdown(true);
							}}
							onFocus={() => setShowDropdown(true)}
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
							autoComplete="off"
						/>
						{showDropdown && (
							<ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{ zIndex: 50 }}>
								{INDIAN_CITIES.filter(city => city.toLowerCase().includes(location.toLowerCase())).map(city => (
									<li
										key={city}
										className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-900"
										onClick={() => {
											setLocation(city);
											setShowDropdown(false);
											handleSearch(city);
										}}
									>
										{city}
									</li>
								))}
								{INDIAN_CITIES.filter(city => city.toLowerCase().includes(location.toLowerCase())).length === 0 && (
									<li className="px-4 py-2 text-gray-400">No cities found</li>
								)}
							</ul>
						)}
					</div>
					<button
						type="button"
						disabled={loading || !location}
						onClick={() => handleSearch(location)}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap"
					>
						{loading ? "Searching..." : "Search"}
					</button>
				</div>
				<h2 className="text-xl font-semibold text-gray-700 mb-4">Billboard Heatmap</h2>
				<div className="w-full h-[400px] max-w-3xl mx-auto rounded-lg overflow-hidden border border-gray-200">
					<MapComponent coords={coords} cityName={cityName} />
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
