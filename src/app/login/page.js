"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://backendeva.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Erreur de connexion");
      }

      const { token, user } = await res.json();

      // Stocker le token JWT dans localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Rediriger vers l'accueil ou la fiche d'évaluation
      router.push("/evaluation");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

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
        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded w-full">
          🔐 Se connecter
        </button>
      </form>
    </main>
  );
}
