"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8001"; // Your FastAPI server

export default function FlaggedReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    billboard_id: "",
    report_id: "",
    location: "",
    date: "",
    reason: "",
    status: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch reports on mount
  useEffect(() => {
    setLoading(true);
    setError("");
    axios.get(`${BASE_URL}/reports/`)
      .then(res => setReports(res.data))
      .catch(() => setError("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Setup multipart form data
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.post(`${BASE_URL}/reports/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Report submitted successfully.");
      setForm({
        billboard_id: "",
        report_id: "",
        location: "",
        date: "",
        reason: "",
        status: "",
        image: null,
      });
      fetchReports();
    } catch {
      setError("Failed to submit report");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Flagged Reports</h2>
      <form
        className="mb-6 grid grid-cols-3 gap-4 bg-black p-4 rounded"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input name="billboard_id" value={form.billboard_id} onChange={handleChange} placeholder="Billboard ID" className="p-2 border rounded" required />
        <input name="report_id" value={form.report_id} onChange={handleChange} placeholder="Report ID" className="p-2 border rounded" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="Date" className="p-2 border rounded" required />
        <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" className="p-2 border rounded" required />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Status" className="p-2 border rounded" required />
        <input name="image" type="file" accept="image/*" onChange={handleChange} className="p-2 border rounded col-span-3" />
        <button type="submit" className="col-span-3 bg-green-600 text-white px-4 py-2 rounded">
          Submit Flagged Report
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-black font-bold">Billboard</th>
            <th className="p-2 text-black font-bold">Report ID</th>
            <th className="p-2 text-black font-bold">Location</th>
            <th className="p-2 text-black font-bold">Date</th>
            <th className="p-2 text-black font-bold">Reason</th>
            <th className="p-2 text-black font-bold">Status</th>
            <th className="p-2 text-black font-bold">Image</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="p-4 text-center text-gray-500">Loading...</td></tr>
          ) : error ? (
            <tr><td colSpan={7} className="p-4 text-center text-red-500">{error}</td></tr>
          ) : reports.length === 0 ? (
            <tr><td colSpan={7} className="p-4 text-center text-gray-400">No reports found.</td></tr>
          ) : reports.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.billboard_id}</td>
              <td className="p-2">{r.report_id}</td>
              <td className="p-2">{r.location}</td>
              <td className="p-2">{r.date}</td>
              <td className="p-2">{r.reason}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                {r.image_path 
                  ? <img src={`http://localhost:8001/${r.image_path.replace("\\","/")}`} alt="Flag" className="w-16 h-16 object-cover" />
                  : "No image"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

