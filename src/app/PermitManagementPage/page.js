"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
// API base URL must match backend
const BASE = "http://localhost:8001";


export default function PermitManagementPage() {
  // Form state for all required fields
  const [permits, setPermits] = useState([]);
  const [form, setForm] = useState({
    permit_id: "",
    billboard_id: "",
    location: "",
    zone: "",
    permit_issue_date: "",
    permit_expiry_date: "",
    max_width_meters: "",
    max_height_meters: "",
    permit_status: "",
    license_number: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch permits on mount
  useEffect(() => { fetchPermits(); }, []);
  const fetchPermits = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE}/permits/`);
      setPermits(res.data);
    } catch {
      setError("Failed to load permits");
    }
    setLoading(false);
  };

  // Validate form before submit
  const validateForm = () => {
    if (!form.permit_id || !form.billboard_id || !form.location || !form.zone || !form.permit_issue_date || !form.permit_expiry_date || !form.max_width_meters || !form.max_height_meters || !form.permit_status || !form.license_number) {
      setError("All fields are required.");
      return false;
    }
    // Date format yyyy-mm-dd
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.permit_issue_date) || !dateRegex.test(form.permit_expiry_date)) {
      setError("Dates must be in yyyy-mm-dd format.");
      return false;
    }
    // Floats
    if (isNaN(parseFloat(form.max_width_meters)) || isNaN(parseFloat(form.max_height_meters))) {
      setError("Width and height must be numbers.");
      return false;
    }
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        max_width_meters: parseFloat(form.max_width_meters),
        max_height_meters: parseFloat(form.max_height_meters)
      };
      await axios.post(`${BASE}/permits/`, payload);
      setSuccess("Permit added successfully.");
      setForm({
        permit_id: "",
        billboard_id: "",
        location: "",
        zone: "",
        permit_issue_date: "",
        permit_expiry_date: "",
        max_width_meters: "",
        max_height_meters: "",
        permit_status: "",
        license_number: ""
      });
      fetchPermits();
    } catch {
      setError("Failed to add permit");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Permit Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-3 gap-4">
        <input value={form.permit_id} onChange={e => setForm(f => ({ ...f, permit_id: e.target.value }))} placeholder="Permit ID" className="border p-2 rounded" required />
        <input value={form.billboard_id} onChange={e => setForm(f => ({ ...f, billboard_id: e.target.value }))} placeholder="Billboard ID" className="border p-2 rounded" required />
        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" className="border p-2 rounded" required />
        <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="Zone" className="border p-2 rounded" required />
        <input value={form.permit_issue_date} onChange={e => setForm(f => ({ ...f, permit_issue_date: e.target.value }))} type="date" className="border p-2 rounded" required />
        <input value={form.permit_expiry_date} onChange={e => setForm(f => ({ ...f, permit_expiry_date: e.target.value }))} type="date" className="border p-2 rounded" required />
        <input value={form.max_width_meters} onChange={e => setForm(f => ({ ...f, max_width_meters: e.target.value }))} type="number" step="0.01" placeholder="Max Width (m)" className="border p-2 rounded" required />
        <input value={form.max_height_meters} onChange={e => setForm(f => ({ ...f, max_height_meters: e.target.value }))} type="number" step="0.01" placeholder="Max Height (m)" className="border p-2 rounded" required />
        <input value={form.permit_status} onChange={e => setForm(f => ({ ...f, permit_status: e.target.value }))} placeholder="Permit Status" className="border p-2 rounded" required />
        <input value={form.license_number} onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} placeholder="License Number" className="border p-2 rounded" required />
        <button type="submit" className="col-span-3 bg-blue-600 text-white px-4 py-2 rounded">Add Permit</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-black font-bold">Permit ID</th>
            <th className="p-2 text-black font-bold">Billboard ID</th>
            <th className="p-2 text-black font-bold">Location</th>
            <th className="p-2 text-black font-bold">Zone</th>
            <th className="p-2 text-black font-bold">Issue Date</th>
            <th className="p-2 text-black font-bold">Expiry Date</th>
            <th className="p-2 text-black font-bold">Width (m)</th>
            <th className="p-2 text-black font-bold">Height (m)</th>
            <th className="p-2 text-black font-bold">Status</th>
            <th className="p-2 text-black font-bold">License #</th>
          </tr>
        </thead>
        <tbody>
          {permits.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.permit_id}</td>
              <td className="p-2">{p.billboard_id}</td>
              <td className="p-2">{p.location}</td>
              <td className="p-2">{p.zone}</td>
              <td className="p-2">{p.permit_issue_date}</td>
              <td className="p-2">{p.permit_expiry_date}</td>
              <td className="p-2">{p.max_width_meters}</td>
              <td className="p-2">{p.max_height_meters}</td>
              <td className="p-2">{p.permit_status}</td>
              <td className="p-2">{p.license_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
