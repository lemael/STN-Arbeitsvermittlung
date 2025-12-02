import { Box } from "@mui/material";
import logo from "../../images/logo_dashboard.png";

const Logo = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={logo}
        alt="logo"
        width="120"
        height="120"
        style={{ marginLeft: "50px" }}
      />
    </Box>
  );
};
export default Logo;
