// index.tsx (Page de connexion)

import { useTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import {
  SignInPage,
  type AuthProvider,
  type AuthResponse,
} from "@toolpad/core/SignInPage";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../auth/AuthContext";
import { signIn as checkCredentials } from "./handleConnection"; // Renommer pour éviter le conflit

const providers = [{ id: "credentials", name: "Email and password" }];

export default function NotificationsSignInPageError() {
  const theme = useTheme();
  const navigate = useNavigate();
  // 1. Accès au contexte
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Cela ne devrait pas arriver si <AppProvider> est enveloppé par <AuthProvider>
    throw new Error("AuthContext est null");
  }

  // 2. Nouvelle fonction pour gérer le flux de connexion complet
  const handleToolpadSignIn = async (
    provider: AuthProvider,
    formData?: FormData
  ): Promise<AuthResponse> => {
    // Appel à la fonction de vérification sans contexte
    const response = (await checkCredentials(
      provider,
      formData
    )) as AuthResponse;

    console.log(
      "Login isAuthenticated before update =",
      authContext.isAuthenticated
    );
    // Si la vérification est réussie (erreur vide)
    if (response.error === "") {
      // 3. MISE À JOUR DE L'ÉTAT DANS LE CONTEXTE
      await authContext.login({});

      // L'état isAuthenticated est maintenant true
      console.log(
        "Login successful, isAuthenticated =",
        authContext.isAuthenticated
      );
      // OPTIONNEL : Si SignInPage ne navigue pas automatiquement, vous pouvez forcer la navigation ici
      navigate("/dashboards", { replace: true });
    }

    // 4. Retourne la réponse pour que <SignInPage /> puisse afficher les erreurs ou finaliser
    return response;
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleToolpadSignIn} // Utiliser la fonction qui met à jour l'état
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: true },
        }}
      />
    </AppProvider>
  );
}
