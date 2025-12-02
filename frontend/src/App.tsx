// App.js (CORRIGÉ)
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import routes from "./router"; // Assurez-vous que ce fichier contient le ProtectedRoute

import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
// import SidebarLayout from "./layouts/SidebarLayout"; // Plus besoin de cette importation

import ThemeProvider from "./theme/ThemeProvider";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {content}
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
