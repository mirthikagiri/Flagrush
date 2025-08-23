"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
  // Export CSV function
  const exportCSV = () => {
    const header = ["Report ID", "Location", "Violation Type", "Date", "Status", "Severity", "Zone"];
    const rows = filteredReports.map((r) => [r.id, r.location, r.violationType, r.date, r.status, r.severity, r.zone]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Flagged Billboard Reports", 14, 16);
    const tableColumn = ["Report ID", "Location", "Violation Type", "Date", "Status", "Severity", "Zone"];
    const tableRows = filteredReports.map((r) => [r.id, r.location, r.violationType, r.date, r.status, r.severity, r.zone]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
      theme: "grid",
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });
    doc.save("reports.pdf");
  };

const reports = [
  {
    id: "RPT-001",
    location: "MG Road, Bangalore",
    violationType: "Unlicensed Billboard",
    date: "2025-08-19",
    status: "Pending",
    imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
    severity: "High",
    zone: "Central",
    notes: "Reported by citizen. Needs review.",
    reporterName: "Amit Kumar",
  },
  {
    id: "RPT-002",
    location: "Anna Salai, Chennai",
    violationType: "Obstructive Placement",
    date: "2025-08-18",
    status: "Reviewed",
    imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
    severity: "Medium",
    zone: "South",
    notes: "Obstructs traffic view.",
    reporterName: "Priya Singh",
  },
  {
    id: "RPT-003",
    location: "Connaught Place, Delhi",
    violationType: "Expired Permit",
    date: "2025-08-17",
    status: "Resolved",
    imageUrl: "https://via.placeholder.com/80x60.png?text=Billboard",
    severity: "Low",
    zone: "North",
    notes: "Permit expired last month.",
    reporterName: "Ravi Sharma",
  },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};


export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalReport, setModalReport] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFilteredReports(
        reports.filter(
          (r) =>
            (r.location.toLowerCase().includes(search.toLowerCase()) ||
              r.violationType.toLowerCase().includes(search.toLowerCase())) &&
            (filter ? r.status === filter : true)
        )
      );
      setLoading(false);
    }, 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [search, filter]);

  // Status update function
  const updateStatus = (id, status) => {
    setFilteredReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    );
    if (modalReport && modalReport.id === id) {
      setModalReport({ ...modalReport, status });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <h1 className="text-2xl font-bold mb-6 tracking-tight text-blue-900">
        Flagged Billboard Reports
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 mb-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded bg-green-100 text-green-700 font-medium shadow hover:bg-green-200"
          >
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-medium shadow hover:bg-blue-200"
          >
            Export PDF
          </button>
        </div>
        <input
          type="text"
          placeholder="Search location or violation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Search reports"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading reports...</div>
        ) : filteredReports.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No reports found</div>
        ) : (
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 font-medium">Report ID</th>
                <th className="p-3 font-medium">Location</th>
                <th className="p-3 font-medium">Violation Type</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-blue-50 transition-all">
                  <td className="p-3 font-mono text-sm">{report.id}</td>
                  <td className="p-3 text-gray-900">{report.location}</td>
                  <td className="p-3 text-gray-700">{report.violationType}</td>
                  <td className="p-3 text-gray-500">{report.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[report.status]}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        alt={`Billboard image at ${report.location}`}
                        className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <span className="inline-block w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          fill="none"
                          stroke="#6b7280"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2L15 8H9L12 2ZM12 22V8" />
                          <circle cx="12" cy="16" r="2" />
                        </svg>
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium"
                      onClick={() => { setModalReport(report); setShowModal(true); }}
                      aria-label={`View details for report ${report.id}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal for detailed report view */}
      {showModal && modalReport && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-900">Report Details</h2>
            <div className="mb-2"><span className="font-semibold">Report ID:</span> {modalReport.id}</div>
            <div className="mb-2"><span className="font-semibold">Location:</span> {modalReport.location}</div>
            <div className="mb-2"><span className="font-semibold">Violation Type:</span> {modalReport.violationType}</div>
            <div className="mb-2"><span className="font-semibold">Date:</span> {modalReport.date}</div>
            <div className="mb-2"><span className="font-semibold">Severity:</span> {modalReport.severity}</div>
            <div className="mb-2"><span className="font-semibold">Zone:</span> {modalReport.zone}</div>
            <div className="mb-2"><span className="font-semibold">Notes:</span> {modalReport.notes}</div>
            <div className="mb-2"><span className="font-semibold">Reported by:</span> {modalReport.reporterName}</div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>
              <select
                value={modalReport.status}
                onChange={e => updateStatus(modalReport.id, e.target.value)}
                className="ml-2 px-2 py-1 rounded border"
                aria-label="Update status"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Image:</span><br />
              {modalReport.imageUrl ? (
                <img
                  src={modalReport.imageUrl}
                  alt={`Billboard image at ${modalReport.location}`}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 mt-2"
                />
              ) : (
                <span className="inline-block w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mt-2">
                  <svg width="32" height="32" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2L15 8H9L12 2ZM12 22V8" />
                    <circle cx="12" cy="16" r="2" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
