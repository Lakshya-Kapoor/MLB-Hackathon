import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(
          `http://localhost:8000/auth/verify?token=${token}`
        );
        if (response.ok) {
          setUserToken(token);
        } else {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    }

    verifyToken();
  }, []);

  function login(token: string) {
    localStorage.setItem("token", token);
    setUserToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setUserToken(null);
  }

  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
