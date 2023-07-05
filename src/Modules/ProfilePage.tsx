import { useState, useEffect, useContext } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Settings from "./Settings";
import Listings from "./Listings";
import Layout from "../Components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { LoadingScreen } from "../Components/LoadingScreen";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam === "0") {
        setBreadcrumbs([
          { path: `/profile?tab=${0}`, breadcrumbName: "Settings" },
        ]);
      } else if (tabParam === "1") {
        setBreadcrumbs([
          { path: `/profile?tab=${1}`, breadcrumbName: "My Listings" },
        ]);
      }
      setTab(parseInt(tabParam));
    } else {
      setBreadcrumbs([{ path: "/profile", breadcrumbName: "Profile" }]);
    }
    setLoading(false);
  }, [location]);

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", newValue.toString());
    navigate({ search: searchParams.toString() });
  };
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="profile tabs"
            style={{ padding: "0 20px" }}
          >
            <Tab label="Settings" sx={{ textTransform: "none" }} />
            <Tab label="My Listings" sx={{ textTransform: "none" }} />
          </Tabs>
        </Box>
        {tab === 0 && <Settings />}
        {tab === 1 && <Listings />}
      </Box>
    </Layout>
  );
};

export default Profile;
