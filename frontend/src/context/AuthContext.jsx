import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser } from "../api/auth";

/*
  Wrap <App /> in <AuthProvider> (see App.jsx). Then anywhere in the app:
    const { user, login, logout, loading } = useAuth();
*/

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session on load

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null); // not logged in — normal, not an error to show the user
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (credentials) => {
  await loginUser(credentials);

  const currentUser = await getCurrentUser();
  setUser(currentUser);

  return currentUser;
};

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
