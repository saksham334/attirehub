import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginRequest, registerRequest } from "../services/authService";

const AuthContext = createContext(null);
const TOKEN_KEY = "attirehub_token";

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If a token exists we must verify it with the server before deciding
  const [loading, setLoading] = useState(() => Boolean(readToken()));

  // On first load: if a token is saved, ask the server who it belongs to
  useEffect(() => {
    if (!readToken()) return;
    let ignore = false;

    fetchMe()
      .then((data) => { if (!ignore) setUser(data); })
      .catch(() => {
        // Expired or invalid token: forget it
        try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
      })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, []);

  // Saves the token and user after a successful login or register
  const saveSession = ({ token, ...userData }) => {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => saveSession(await loginRequest(email, password));
  const register = async (name, email, password) =>
    saveSession(await registerRequest(name, email, password));

  const logout = () => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setUser(null);
  };

  const value = { user, loading, isAdmin: user?.role === "ADMIN", login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};