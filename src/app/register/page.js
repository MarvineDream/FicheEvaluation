"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await fetch("https://backendeva.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, password })
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Erreur lors de l'inscription");
      }

      alert("✅ Inscription réussie !");
      router.push("/login"); // Redirection vers la page de connexion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded w-full">
          ➕ S inscrire
        </button>
      </form>
    </main>
  );
}
