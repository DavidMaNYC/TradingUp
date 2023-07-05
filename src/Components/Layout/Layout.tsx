import { FC, ReactNode, CSSProperties, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../Utils/firebase";
import StoreIcon from "@mui/icons-material/Store";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "./Components/Logo";
import "./Layout.css";
import { useMatch } from "react-router-dom";
import DynamicBreadcrumbs from "./Components/DynamicBreadcrumbs";
interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 850);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User signed out");
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const linkStyle: CSSProperties = {
    textDecoration: "none",
    color: "#000",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "transparent",
    transition: "background-color 0.3s ease",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const navStyle: CSSProperties & { [key: string]: any } = {
    width: isMobile ? (menuOpen ? "250px" : "0") : "250px",
    visibility: isMobile ? (menuOpen ? "visible" : "hidden") : "visible",
    padding: "20px",
    color: "#015d99",
    display: "flex",
    flexDirection: "column",
    position: isMobile ? "fixed" : "static",
    top: 0,
    left: 0,
    zIndex: 1,
    height: "calc(100svh - 40px)",
    transition: "width 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const navToggleStyle: CSSProperties & { [key: string]: any } = {
    display: isMobile ? "block" : "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "10px",
    color: "#fff",
    textAlign: "center",
    cursor: "pointer",
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 1,
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    lineHeight: "40px",
    fontSize: "24px",
  };

  const mainStyle: CSSProperties & { [key: string]: any } = {
    flex: 1,
    padding: "20px",
    transition: "padding 0.3s ease",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f1f2f4",
    gap: "20px",
    height: "calc(100% - 40px)",
  };

  const contentStyle: CSSProperties & { [key: string]: any } = {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: "100%",
    borderRadius: "5px",
    justifyContent: "center",
    overflowY: "auto",
  };
  const activeStyle: CSSProperties = {
    backgroundColor: "#2F73E00D",
    color: "#2F73E0",
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100svh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <nav style={navStyle}>
        <Logo />
        <ul
          style={{
            listStyleType: "none",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <li>
            <NavLink
              to="/home"
              style={
                useMatch("/home") ? { ...linkStyle, ...activeStyle } : linkStyle
              }
            >
              <StoreIcon /> Browse All
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transaction"
              style={
                useMatch("/transaction")
                  ? { ...linkStyle, ...activeStyle }
                  : linkStyle
              }
            >
              <HandshakeIcon /> My Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messages"
              style={
                useMatch("/messages")
                  ? { ...linkStyle, ...activeStyle }
                  : linkStyle
              }
            >
              <EmailIcon /> My Messages
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              style={
                useMatch("/profile")
                  ? { ...linkStyle, ...activeStyle }
                  : linkStyle
              }
            >
              <AccountCircleIcon /> My Profile
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              onTouchStart={handleLogout}
              style={{
                ...linkStyle,
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <ExitToAppIcon />
              Logout
            </button>
          </li>
        </ul>
      </nav>
      {isMobile && (
        <div
          style={navToggleStyle}
          onTouchStart={() => setMenuOpen(!menuOpen)}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      )}
      <main style={mainStyle}>
        <DynamicBreadcrumbs />
        <div style={contentStyle}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
