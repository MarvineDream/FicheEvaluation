"use client";

import { useEffect, useState } from "react";

const API_URL = "https://backendeva.onrender.com/staff";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [form, setForm] = useState({ nom: "", poste: "", departement: "", dateFinContrat: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchStaff = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStaffs(data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ nom: "", poste: "", departement: "", dateFinContrat: "" });
    setEditingId(null);
    fetchStaff();
  };

  const handleEdit = (staff) => {
    setForm({
      nom: staff.nom,
      poste: staff.poste,
      departement: staff.departement,
      dateFinContrat: staff.dateFinContrat?.substring(0, 10),
    });
    setEditingId(staff._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce membre du staff ?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchStaff();
    }
  };

  return (
    <div className="flex">
      

      {/* Main */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Gestion du Personnel</h1>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nom"
              placeholder="Nom complet"
              value={form.nom}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="poste"
              placeholder="Poste"
              value={form.poste}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="departement"
              placeholder="Département"
              value={form.departement}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <input
              type="date"
              name="dateFinContrat"
              placeholder="Date de fin de contrat"
              value={form.dateFinContrat}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {editingId ? "Modifier" : "Ajouter"}
          </button>
        </form>

        {/* Liste du staff */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Liste du staff</h2>
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2">Nom</th>
                <th className="text-left p-2">Poste</th>
                <th className="text-left p-2">Département</th>
                <th className="text-left p-2">Fin contrat</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.nom}</td>
                  <td className="p-2">{s.poste}</td>
                  <td className="p-2">{s.departement}</td>
                  <td className="p-2">{new Date(s.dateFinContrat).toLocaleDateString()}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(s)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDelete(s._id)} className="text-red-600">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
