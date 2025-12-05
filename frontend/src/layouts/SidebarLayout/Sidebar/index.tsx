import {
  Box,
  Divider,
  Drawer,
  alpha,
  darken,
  lighten,
  styled,
  useTheme,
} from "@mui/material";
import { useContext } from "react";
import Logo from "../../../components/Logo";
import Scrollbar from "../../../components/Scrollbar";
import { SidebarContext } from "../../../contexts/SidebarContext";
import { Logout } from "../Sidebar/Logout";
import SidebarMenu from "../Sidebar/SidebarMenu";
// NOUVEL IMPORT : Importation du hook du LayoutContext
import { useInboxContext } from "../../../contexts/InboxContext";
import { useLayoutContext } from "../../../contexts/LayoutContext";

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: theme.sidebar.width,
  minWidth: theme.sidebar.width,
  color: theme.colors.alpha.trueWhite[70],
  position: "relative",
  zIndex: 7,
  height: "100%",
  paddingBottom: "68px",
}));

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  // NOTE: On utilise l'InboxContext pour obtenir le nombre de notifications
  const { notificationCount } = useInboxContext();
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();
  // 1. Récupération des valeurs de navigation/état via le LayoutContext
  const { activePage, onNavigate } = useLayoutContext();
  return (
    <>
      <SidebarWrapper
        sx={{
          display: { xs: "none", lg: "inline-block" },
          position: "fixed",
          left: 0,
          top: 0,
          background:
            theme.palette.mode === "dark"
              ? alpha(lighten(theme.header.background || "#000", 0.1), 0.5)
              : darken(theme.colors.alpha.black[100], 0.5),
        }}
      >
        <Box mt={3}>
          <Box mx={2} sx={{ width: 52 }}>
            <Logo />
          </Box>
        </Box>
        <Divider
          sx={{ mt: 3, mx: 2, background: theme.colors.alpha.trueWhite[10] }}
        />
        <SidebarMenu
          activePage={activePage}
          onNavigate={onNavigate}
          notificationCount={notificationCount}
        />
        <Divider sx={{ background: theme.colors.alpha.trueWhite[10] }} />
        <Logout />
      </SidebarWrapper>
      <Drawer
        sx={{ boxShadow: theme.sidebar.boxShadow }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background:
              theme.palette.mode === "dark"
                ? theme.colors.alpha.white[100]
                : darken(theme.colors.alpha.black[100], 0.5),
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box mx={2} sx={{ width: 52 }}>
                <Logo />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: 3,
                mx: 2,
                background: theme.colors.alpha.trueWhite[10],
              }}
            />
            <SidebarMenu
              activePage={activePage}
              onNavigate={onNavigate}
              notificationCount={notificationCount}
            />
            <Divider sx={{ background: theme.colors.alpha.trueWhite[10] }} />
            <Logout />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
};

export default Sidebar;
