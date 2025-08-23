"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("./components/LeafletMap"), { ssr: false });

// Dummy data for reports
const reports = [
	{
		id: "RPT-001",
		location: "MG Road, Bangalore",
		violationType: "Unlicensed Billboard",
		date: "2025-08-19",
		status: "Pending",
		imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
		lat: 12.975, lng: 77.605
	},
	{
		id: "RPT-002",
		location: "Anna Salai, Chennai",
		violationType: "Obstructive Placement",
		date: "2025-08-18",
		status: "Reviewed",
		imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
		lat: 13.0827, lng: 80.2707
	},
	{
		id: "RPT-003",
		location: "Connaught Place, Delhi",
		violationType: "Expired Permit",
		date: "2025-08-17",
		status: "Resolved",
		imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
		lat: 28.6139, lng: 77.2090
	}
];

const summary = [
	{ label: "Total Reports", value: reports.length },
	{ label: "Violation Categories", value: "3" },
	{ label: "Recent Reports", value: "2" }
];

export default function Dashboard() {
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");

	// Filtered reports
	const filteredReports = reports.filter(r =>
		(r.location.toLowerCase().includes(search.toLowerCase()) ||
			r.violationType.toLowerCase().includes(search.toLowerCase())) &&
		(filter ? r.status === filter : true)
	);

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
			{/* Sidebar */}
			<aside className="w-56 bg-gray-100 border-r flex flex-col p-4 space-y-6 shadow-sm">
				<div className="font-bold text-xl mb-6 tracking-tight flex items-center gap-2">
					<span className="inline-block w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H9L12 2ZM12 22V8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="16" r="2" fill="#2563eb"/></svg>
					</span>
					FlagRush
				</div>
				<nav className="flex flex-col gap-3 text-sm">
					<a href="/" className="flex items-center gap-2 px-3 py-2 rounded text-blue-700 bg-blue-50 font-medium">
						<svg width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"/></svg>
						Dashboard
					</a>
					<a href="/report" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200 text-gray-700">
						<svg width="18" height="18" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
						Reports
					</a>
					   <a href="/PermitManagementPage" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 text-green-700">
						   <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8M8 16h8"/></svg>
						   Permit Management
					   </a>
					   <a href="/FlaggedReportsPage" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-yellow-50 text-yellow-700">
						   <svg width="18" height="18" fill="none" stroke="#eab308" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 8h8v8H8z"/></svg>
						   Flagged Reports
					   </a>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col">
				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
					{summary.map((card, idx) => (
						<div key={idx} className="rounded-xl shadow-sm p-6 bg-blue-50 flex flex-col items-start gap-2">
							<div className="text-4xl font-bold mb-1 text-blue-900 tracking-tight">{card.value}</div>
							<div className="text-lg font-medium text-gray-700">{card.label}</div>
						</div>
					))}
				</div>

				{/* Reports Table & Map */}
				<div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
					{/* Reports Table */}
					<section className="md:w-2/3 bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
						<div className="flex items-center gap-4 mb-4">
							<input
								type="text"
								placeholder="Search location or violation..."
								value={search}
								onChange={e => setSearch(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
							/>
							<select
								value={filter}
								onChange={e => setFilter(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
							>
								<option value="">All Status</option>
								<option value="Pending">Pending</option>
								<option value="Reviewed">Reviewed</option>
								<option value="Resolved">Resolved</option>
							</select>
						</div>
						<table className="w-full text-left font-sans">
							<thead>
								<tr className="bg-gray-100 text-gray-700">
									<th className="p-3 font-medium">Report ID</th>
									<th className="p-3 font-medium">Location</th>
									<th className="p-3 font-medium">Violation Type</th>
									<th className="p-3 font-medium">Date</th>
									<th className="p-3 font-medium">Status</th>
									<th className="p-3 font-medium">Image</th>
								</tr>
							</thead>
							<tbody>
								{filteredReports.map(report => (
									<tr key={report.id} className="border-b hover:bg-blue-50 transition-all">
										<td className="p-3 font-mono text-sm">{report.id}</td>
										<td className="p-3 text-gray-900">{report.location}</td>
										<td className="p-3 text-gray-700">{report.violationType}</td>
										<td className="p-3 text-gray-500">{report.date}</td>
										<td className="p-3">
											<span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
												report.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
												report.status === "Reviewed" ? "bg-blue-100 text-blue-800" :
												"bg-green-100 text-green-800"
											}`}>
												{report.status}
											</span>
										</td>
										<td className="p-3">
											{report.imageUrl ? (
												<img src={report.imageUrl} alt="Billboard" className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
											) : (
												<span className="inline-block w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
													<svg width="24" height="24" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L15 8H9L12 2ZM12 22V8"/><circle cx="12" cy="16" r="2"/></svg>
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>

					{/* Map Section */}
					<section className="md:w-1/3 bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
						<h2 className="text-lg font-semibold mb-4 text-gray-800 tracking-tight">Flagged Billboards Map</h2>
						<LeafletMap reports={filteredReports} />
					</section>
				</div>
			</main>
		</div>
	);
}
