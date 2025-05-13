"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth({ redirectTo = "/login" } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);

      // Si l'utilisateur est un Manager, on appelle /manager avec token
      if (parsedUser.role === "Manager") {
        fetch("https://backendeva.onrender.com/staff/manager", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setStaff(Array.isArray(data) ? data : []))
          .catch((err) => {
            console.error("Erreur chargement staff manager:", err);
            setStaff([]);
          });
      }
    } else if (redirectTo) {
      router.push(redirectTo);
    }

    setIsLoading(false);
  }, [redirectTo, router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return { user, token, staff, isLoading, logout };
}
