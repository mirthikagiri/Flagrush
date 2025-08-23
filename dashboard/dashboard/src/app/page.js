"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const LeafletMap = dynamic(() => import("./components/LeafletMap"), { ssr: false });


export default function Dashboard() {

	const [reports, setReports] = useState([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Fetch reports from backend on mount
	React.useEffect(() => {
		setLoading(true);
		setError("");
		axios.get("http://localhost:8001/reports/")
			.then(res => setReports(res.data))
			.catch(() => setError("Failed to load reports"))
			.finally(() => setLoading(false));
	}, []);

	// Filtered reports for table/search/filter
	const filteredReports = reports.filter(r =>
		(r.location?.toLowerCase().includes(search.toLowerCase()) ||
			r.violationType?.toLowerCase().includes(search.toLowerCase())) &&
		(filter ? r.status === filter : true)
	);

	// Only valid flagged billboards for map
	const mapMarkers = filteredReports.filter(r => r.lat && r.lng);

	// Summary cards
	const summary = [
		{ label: "Total Reports", value: reports.length },
		{ label: "Violation Categories", value: new Set(reports.map(r => r.violationType)).size },
		{ label: "Recent Reports", value: reports.filter(r => r.date && (new Date() - new Date(r.date)) < 7 * 24 * 60 * 60 * 1000).length }
	];

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
								<option value="Flagged">Flagged</option>
							</select>
						</div>
						{renderReportTable({ reports: filteredReports, loading, error })}
					</section>

					{/* Map */}
					<section className="md:w-1/3 bg-white rounded-xl shadow-sm p-4">
						<h2 className="text-lg font-semibold mb-4">Map View</h2>
						<div className="h-64 rounded-lg overflow-hidden">
							<LeafletMap markers={mapMarkers} />
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

function renderReportTable({ reports, loading, error }) {
	if (loading) return <div className="p-4 text-center">Loading...</div>;
	if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
	if (reports.length === 0) return <div className="p-4 text-center text-gray-500">No reports found.</div>;

	return (
		<table className="min-w-full divide-y divide-gray-200">
			<thead className="bg-gray-50">
				<tr>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Billboard_id</th>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Report_id</th>

					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Location</th>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Violation Type</th>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
					<th className="p-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{reports.map((report, idx) => (
					<tr key={idx} className="hover:bg-gray-50 transition-colors">
						<td className="p-3 text sm text-gray-700">{report.billboard_id}</td>
						<td className="p-3 text sm text-gray-700">{report.report_id}</td>
						<td className="p-3 text-sm text-gray-700">{report.location}</td>
						<td className="p-3 text-sm text-gray-700">{report.reason}</td>
						<td className="p-3 text-sm text-gray-700">{new Date(report.date).toLocaleDateString()}</td>
						<td className="p-3 text-sm text-gray-700">
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${report.status === "Resolved" ? "bg-green-100 text-green-700" : report.status === "Reviewed" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
								{report.status}
							</span>
						</td>
						<td className="p-3 text-sm text-gray-700">
							{report.image ? (
								<a href={report.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
									View Image
								</a>
							) : (
								<span className="text-gray-400">No Image</span>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
