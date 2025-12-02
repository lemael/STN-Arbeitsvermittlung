import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
// Assurez-vous d'ajuster le chemin d'importation de AuthContext si nécessaire
import { AuthContext } from "../../../../auth/AuthContext";

export const Logout: React.FC = () => {
  const navigate = useNavigate();
  // 1. Accéder au contexte d'authentification
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "Le composant Logout doit être utilisé dans un AuthProvider."
    );
  }

  const handleLogout = () => {
    // 2. Réinitialiser l'état d'authentification (isAuthenticated = false)
    authContext.logout();

    // 3. Rediriger vers la page de connexion
    navigate("/login_dashboard", { replace: true });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        p: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};
