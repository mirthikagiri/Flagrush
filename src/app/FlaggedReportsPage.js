"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
const BASE = "http://localhost:8001";

export default function FlaggedReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => { fetchReports(); }, []);
  const fetchReports = async () => {
    setLoading(true);
    try { setReports(await axios.get(`${BASE}/flagged_reports`).then(res => res.data)); } catch { setError("Failed to load reports"); }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`${BASE}/flagged_reports/${id}`, { status });
      fetchReports();
    } catch { setError("Failed to update status"); }
    setLoading(false);
  };

  const addComment = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${BASE}/flagged_reports/${id}/comments`, { comment });
      setComment("");
      fetchReports();
    } catch { setError("Failed to add comment"); }
    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Flagged Reports", 14, 16);
    doc.autoTable({
      head: [["Billboard", "Location", "Reason", "Status"]],
      body: reports.map(r => [r.billboard_id, r.location, r.reason, r.status]),
    });
    doc.save("flagged_reports.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Flagged Reports</h2>
      <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded mb-4">Export PDF</button>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mb-4">
        <thead>
          <tr>
            <th>Billboard</th><th>Location</th><th>Reason</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r._id}>
              <td>{r.billboard_id}</td><td>{r.location}</td><td>{r.reason}</td><td>{r.status}</td>
              <td>
                <button onClick={() => setModal(r)} className="text-blue-600">View</button>
                <button onClick={() => updateStatus(r._id, "Resolved")} className="ml-2 text-green-600">Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="font-bold mb-2">Report Details</h3>
            <div><b>Billboard:</b> {modal.billboard_id}</div>
            <div><b>Location:</b> {modal.location}</div>
            <div><b>Reason:</b> {modal.reason}</div>
            <div><b>Status:</b> {modal.status}</div>
            <div className="mt-2">
              <b>Comments:</b>
              <ul className="list-disc ml-4">
                {(modal.comments || []).map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <form onSubmit={e => { e.preventDefault(); addComment(modal._id); }} className="mt-2 flex gap-2">
              <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment" className="border p-2 rounded w-full" />
              <button type="submit" className="bg-blue-600 text-white px-2 rounded">Add</button>
            </form>
            <button onClick={() => setModal(null)} className="mt-4 text-red-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
