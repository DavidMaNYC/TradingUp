import ReactDOM from "react-dom/client";
import App from "./Modules/App.tsx";
import "./index.css";
import { UserProvider } from "./Utils/UserProvider";
import { BreadcrumbProvider } from "./Utils/BreadcrumbProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <UserProvider>
    <BreadcrumbProvider>
      <App />
    </BreadcrumbProvider>
  </UserProvider>
);
