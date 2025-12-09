// App.js (CORRIGÉ)
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import routes from "./router"; // Assurez-vous que ce fichier contient le ProtectedRoute

import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import { InboxProvider } from "./contexts/InboxContext";
import { LayoutProvider } from "./contexts/LayoutContext";
import { SubunternehmerProvider } from "./contexts/SubunternehmerContext";
// import SidebarLayout from "./layouts/SidebarLayout"; // Plus besoin de cette importation

import ThemeProvider from "./theme/ThemeProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // GESTION DE L'ÉTAT DE NAVIGATION DANS APP.TSX
  const [activePage, setActivePage] = useState(location.pathname);

  // Fonction de navigation mise à disposition via le LayoutContext
  const onNavigate = (pageName: string) => {
    navigate(pageName);
    setActivePage(pageName);
  };

  // Met à jour l'état de la page active lorsque la localisation change (ex: navigation par bouton retour/avant)
  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);
  /*
  **SUPPRESSION DU BLOC QUI ÉCRASE LA ROUTE /dashboards**
  
  const onNavigate = (pageName: string) => {
    navigate(pageName);
    setActivePage(pageName);
  };

  const updatedRoutes = routes.map((route) => {
    if (route.path === "dashboards") {
      return {
        ...route,
        element: (
          <SidebarLayout activePage={activePage} onNavigate={onNavigate} />
        ),
      };
    }
    return route;
  });
  
  const content = useRoutes(updatedRoutes);
  */

  // Utiliser directement les routes non modifiées
  const content = useRoutes(routes);

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* 🚨 Le LayoutProvider enveloppe tout le contenu des routes pour injecter le contexte 🚨 */}
        <LayoutProvider activePage={activePage} onNavigate={onNavigate}>
          <InboxProvider>
            <SubunternehmerProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                {content}
              </LocalizationProvider>
            </SubunternehmerProvider>
          </InboxProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
