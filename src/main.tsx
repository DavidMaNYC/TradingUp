import ReactDOM from "react-dom/client";
import App from "./Modules/App.tsx";
import "./index.css";
import { UserProvider } from "./Utils/UserProvider";
import { BreadcrumbProvider } from "./Utils/BreadcrumbProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    button: {
      textTransform: "none", // Set textTransform to "none" to prevent uppercase
    },
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <UserProvider>
    <BreadcrumbProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BreadcrumbProvider>
  </UserProvider>
);
