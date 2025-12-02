// ProtectedRoute.tsx (Modification)
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
  children: (isAuthenticated: boolean) => React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext est null");
  }

  const { isAuthenticated } = authContext;

  // 👈 AJOUTEZ CETTE LIGNE
  console.log("ProtectedRoute: isAuthenticated =", isAuthenticated);

  if (!isAuthenticated) {
    // Si isAuthenticated est false, l'utilisateur est redirigé vers la page de connexion
    return <Navigate to="/login_dashboard" replace />;
  }

  return children(isAuthenticated);
};

export default ProtectedRoute;
