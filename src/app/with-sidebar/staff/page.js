"use client";

import { useEffect, useState } from "react";

const API_URL = "https://backendeva.onrender.com/staff";

export default function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    departement: "",
    typeContrat: "CDD",
    dateEmbauche: "",
    dateFinContrat: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Simuler un statut d’évaluation
  const getRandomStatus = () => {
    const statusList = ["En attente", "En cours", "Envoyée"];
    return statusList[Math.floor(Math.random() * statusList.length)];
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/manager`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const staffArray = Array.isArray(data)
          ? data.map((s) => ({ ...s, statutEvaluation: getRandomStatus() }))
          : [];
        setStaffs(staffArray);
      } catch (err) {
        console.error("Erreur chargement staff manager:", err);
        setStaffs([]);
      }
    };
  
    fetchStaff();
  }, []);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'enregistrement");
      }

      setForm({
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        departement: "",
        typeContrat: "CDD",
        dateEmbauche: "",
        dateFinContrat: "",
      });
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEdit = (staff) => {
    setForm({
      nom: staff.nom,
      prenom: staff.prenom || "",
      email: staff.email,
      poste: staff.poste,
      departement: staff.departement,
      typeContrat: staff.typeContrat,
      dateEmbauche: staff.dateEmbauche?.substring(0, 10),
      dateFinContrat: staff.dateFinContrat?.substring(0, 10) || "",
    });
    setEditingId(staff._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (confirm("Supprimer ce membre du staff ?")) {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Mon Équipe</h1>

        {/* Formulaire d'ajout/modification */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["nom", "prenom", "email", "poste", "departement"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
                required={["nom", "email", "poste", "departement"].includes(field)}
              />
            ))}

            <select
              name="typeContrat"
              value={form.typeContrat}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            >
              <option value="CDD">CDD</option>
              <option value="CDI">CDI</option>
              <option value="Stagiaire">Stagiaire</option>
            </select>

            <input
              type="date"
              name="dateEmbauche"
              value={form.dateEmbauche}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <input
              type="date"
              name="dateFinContrat"
              value={form.dateFinContrat}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {editingId ? "Modifier" : "Ajouter"}
          </button>
        </form>

        {/* Liste du personnel */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Équipe à évaluer</h2>
          <table className="w-full border table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-2">Nom</th>
                <th className="text-left p-2">Prénom</th>
                <th className="text-left p-2">Poste</th>
                <th className="text-left p-2">Département</th>
                <th className="text-left p-2">Fin contrat</th>
                <th className="text-left p-2">Statut évaluation</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{s.nom}</td>
                  <td className="p-2">{s.prenom}</td>
                  <td className="p-2">{s.poste}</td>
                  <td className="p-2">{s.departement}</td>
                  <td className="p-2">
                    {s.dateFinContrat
                      ? new Date(s.dateFinContrat).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        s.statutEvaluation === "En attente"
                          ? "bg-orange-500"
                          : s.statutEvaluation === "En cours"
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                    >
                      {s.statutEvaluation}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600"
                    >
                      🗑️
                    </button>
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
