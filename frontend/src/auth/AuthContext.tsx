// AuthContext.tsx (Corrigé)
import { createContext, ReactNode, useEffect, useState } from "react"; // Ajout de useEffect

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // 1. Initialisez l'état à partir de localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth === "true"; // Retourne true si stocké, sinon false
  });

  // 2. Mettez à jour localStorage à chaque changement de isAuthenticated
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = async (credentials: any) => {
    // Votre logique de connexion ici
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
