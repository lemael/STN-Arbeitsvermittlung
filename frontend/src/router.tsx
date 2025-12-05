// router.js
import { ComponentType, Suspense, lazy } from "react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import SuspenseLoader from "./components/SuspenseLoader/SuspenseLoader";
import BaseLayout from "./layouts/BaseLayout";
import SidebarLayout from "./layouts/SidebarLayout";

// Importez vos autres composants de page ici

const Loader =
  <P extends object>(Component: ComponentType<P>): ComponentType<P> =>
  (props: P) => (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );
// Applications

const HomeDashboard = Loader(
  lazy(() => import("./content/applications/Home_Dashboard/index"))
);
const TableauxDeGestion = Loader(
  lazy(() => import("./content/applications/Tableaux_de_Gestion/index"))
);
const BoiteDeReception = Loader(
  lazy(() => import("./content/applications/BoiteDeReception/index"))
);
// Pages
const Home = Loader(lazy(() => import("./content/pages/Home/index")));
const Subunternehmer = Loader(
  lazy(() => import("./content/pages/SubunternehmenAnfrage/index"))
);
const LoginDashboard = Loader(
  lazy(() => import("./content/pages/Login_dashboard/index"))
);
const SubunternehmerFormular = Loader(
  lazy(() => import("./content/applications/SubunternehmerFormular/index"))
);
const LaufendeProjekte = Loader(
  lazy(() => import("./content/applications/LaufendeProjekte/index"))
);
const KundeFormular = Loader(lazy(() => import("./content/pages/Kunde/index")));

const routes: RouteObject[] = [
  {
    path: "",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/kunde-formular",
        element: <KundeFormular />,
      },
      {
        path: "login_dashboard",
        element: <LoginDashboard />,
      },
    ],
  },
  {
    path: "status",
    element: <BaseLayout />,
    children: [
      // Ajoutez vos autres routes ici
      {
        path: "status",
        children: [
          {
            path: "404",
            element: <div>NotFound</div>,
          },
          {
            path: "500",
            element: <div>Server Error</div>,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/status/404" replace />,
      },
    ],
  },

  {
    path: "dashboards",
    element: (
      <ProtectedRoute>
        {(isAuthenticated) => (
          <SidebarLayout activePage={""}>
            <Outlet />
          </SidebarLayout>
        )}
      </ProtectedRoute>
    ),

    children: [
      {
        path: "",
        element: <HomeDashboard />,
      },
      {
        path: "tableaux de Gestion",
        element: <TableauxDeGestion />,
      },
      {
        path: "boiteDeReception",
        element: <BoiteDeReception />,
      },
      {
        path: "subunternehmerFormular",
        element: <SubunternehmerFormular />,
      },
      {
        path: "laufendeProjekte",
        element: <LaufendeProjekte />,
      },
    ],
  },
  {
    path: "",
    element: <Navigate to="dashboards" replace />,
  },
];

export default routes;
