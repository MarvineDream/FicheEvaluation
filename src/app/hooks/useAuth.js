"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth({ redirectTo = "/login" } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
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

  return { user, isLoading, logout };
}
