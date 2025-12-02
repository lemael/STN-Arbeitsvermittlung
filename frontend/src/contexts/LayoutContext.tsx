import React, { createContext, ReactNode, useContext, useMemo } from "react";

// Définition du type de contexte
interface LayoutContextType {
  activePage: string;
  onNavigate: (pageName: string) => void;
}

// Crée le contexte, initialisé à undefined
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Hook pour utiliser le contexte facilement
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    // Si le hook est utilisé en dehors du provider, lance une erreur claire
    throw new Error(
      "useLayoutContext doit être utilisé dans un LayoutProvider"
    );
  }
  return context;
};

// Composant Provider
interface LayoutProviderProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (pageName: string) => void;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  activePage,
  onNavigate,
}) => {
  // Memoization pour éviter les rendus inutiles
  const value = useMemo(
    () => ({ activePage, onNavigate }),
    [activePage, onNavigate]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
