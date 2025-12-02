import { styled } from "@mui/material/styles";

const Scrollbar = styled("div")(({ theme }) => ({
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: `inset 0 0 6px rgba(0,0,0,0.00)`,
    webkitBoxShadow: `inset 0 0 6px rgba(0,0,0,0.00)`,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.colors.alpha.trueWhite[10]
        : theme.colors.alpha.black[10],
    outline: `1px solid ${
      theme.palette.mode === "dark"
        ? theme.colors.alpha.trueWhite[10]
        : theme.colors.alpha.black[10]
    }`,
    borderRadius: "10px",
  },
  overflowY: "auto",
  height: "100%",
}));

export default Scrollbar;
