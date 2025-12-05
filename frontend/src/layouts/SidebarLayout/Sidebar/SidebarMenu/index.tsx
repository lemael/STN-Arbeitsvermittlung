import {
  AddModerator,
  EmailOutlined,
  GolfCourse,
  Home,
} from "@mui/icons-material";
import {
  Badge,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface SidebarMenuProps {
  // activePage doit être l'un des chemins définis
  activePage: string;

  // onNavigate est une fonction qui prend un chemin et ne retourne rien
  onNavigate: (pageName: string) => void;
  // Nouvelle prop: compteur de notifications
  notificationCount: number;
}
const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activePage,
  onNavigate,
  notificationCount,
}) => {
  const menuItems = [
    { name: "home", text: "Home", icon: Home, path: "dashboards" }, // Ceci est le bouton que nous allons regarder
    {
      name: "subunternehmerFormular",
      text: "SubunternehmerFormular",
      icon: AddModerator,
      path: "dashboards/subunternehmerFormular",
    },
    {
      name: "boiteDeReception",
      text: "BoiteDeReception",
      icon: EmailOutlined,
      path: "dashboards/boiteDeReception",
      badge: notificationCount, // Utilise le compteur de notifications ici
    },
    {
      name: "laufendeProjekte",
      text: "Laufende Projekte",
      icon: GolfCourse,
      path: "dashboards/laufendeProjekte",
    },
  ];
  return (
    <List
      component="nav"
      sx={
        {
          /* ... */
        }
      }
    >
      {menuItems.map((item) => (
        <ListItemButton
          key={item.name}
          // Si on clique, la fonction onNavigate est appelée avec le chemin de l'élément.
          onClick={() => onNavigate(item.path)}
          selected={activePage === item.path}
        >
          <ListItemIcon>
            <item.icon />
          </ListItemIcon>

          <ListItemText primary={item.text} />

          {/* LOGIQUE DE NOTIFICATION AJOUTÉE */}
          {item.badge !== undefined && item.badge > 0 && (
            <Badge
              badgeContent={item.badge}
              color="error"
              max={99}
              sx={{
                // Ajuster le style du badge pour qu'il s'affiche correctement à droite du texte
                ml: 1,
                // Pour aligner le badge verticalement avec le texte
                "& .MuiBadge-badge": { right: 0, top: 12 },
              }}
            />
          )}
        </ListItemButton>
      ))}
    </List>
  );
};

export default SidebarMenu;
