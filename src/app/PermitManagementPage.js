"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
const BASE = "http://localhost:8001";

export default function PermitManagementPage() {
  const [permits, setPermits] = useState([]);
  const [form, setForm] = useState({ owner: "", location: "", valid_from: "", valid_to: "", billboard_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchPermits(); }, []);
  const fetchPermits = async () => {
    setLoading(true);
    try { setPermits(await axios.get(`${BASE}/permits`).then(res => res.data)); } catch { setError("Failed to load permits"); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE}/permits`, form);
      setForm({ owner: "", location: "", valid_from: "", valid_to: "", billboard_id: "" });
      fetchPermits();
    } catch { setError("Failed to add permit"); }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Permit Management</h2>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
        <input value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="Owner" className="border p-2 rounded" required />
        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" className="border p-2 rounded" required />
        <input value={form.valid_from} onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))} type="date" className="border p-2 rounded" required />
        <input value={form.valid_to} onChange={e => setForm(f => ({ ...f, valid_to: e.target.value }))} type="date" className="border p-2 rounded" required />
        <input value={form.billboard_id} onChange={e => setForm(f => ({ ...f, billboard_id: e.target.value }))} placeholder="Billboard ID" className="border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Permit</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th>Owner</th><th>Location</th><th>Valid From</th><th>Valid To</th><th>Billboard ID</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map(p => (
            <tr key={p._id}>
              <td>{p.owner}</td><td>{p.location}</td><td>{p.valid_from}</td><td>{p.valid_to}</td><td>{p.billboard_id}</td>
              <td>
                <button onClick={() => axios.delete(`${BASE}/permits/${p._id}`).then(fetchPermits)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
