import { useState, useEffect, useContext } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import TransactionHistory from "./TransactionHistory";
import Offers from "./Offers";
import Layout from "../Components/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { UserContext } from "../Utils/UserProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { LoadingScreen } from "../Components/LoadingScreen";

const TransactionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const { currentUser } = useContext(UserContext);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/offer/user/${
            currentUser?._id
          }`,
          currentUser?.config
        );
        const formattedTransactions = await Promise.all(
          response.data.map(async (transaction: any) => {
            const formattedOffers = await Promise.all(
              transaction.offers.map(async (offer: any) => {
                const formattedImages = await Promise.all(
                  offer.images.map(async (imagePath: string) => {
                    try {
                      const storage = getStorage();
                      const imageRef = ref(storage, imagePath);
                      const downloadURL = await getDownloadURL(imageRef);
                      return { path: imagePath, url: downloadURL };
                    } catch (error) {
                      console.error("Failed to fetch image:", error);
                      return null;
                    }
                  })
                );
                return { ...offer, images: formattedImages };
              })
            );
            const formattedDemands = await Promise.all(
              transaction.demands.map(async (demand: any) => {
                const formattedImages = await Promise.all(
                  demand.images.map(async (imagePath: string) => {
                    try {
                      const storage = getStorage();
                      const imageRef = ref(storage, imagePath);
                      const downloadURL = await getDownloadURL(imageRef);
                      return { path: imagePath, url: downloadURL };
                    } catch (error) {
                      console.error("Failed to fetch image:", error);
                      return null;
                    }
                  })
                );
                return { ...demand, images: formattedImages };
              })
            );
            return {
              ...transaction,
              offers: formattedOffers,
              demands: formattedDemands,
            };
          })
        );
        setTransactions(formattedTransactions);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch transaction history:", error);
        toast.error("Failed to fetch transaction history");
      }
    };

    fetchTransactions();
  }, [currentUser]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      if (tabParam === "0") {
        setBreadcrumbs([
          { path: `/transactions?tab=${0}`, breadcrumbName: "Transactions" },
        ]);
      } else if (tabParam === "1") {
        setBreadcrumbs([
          {
            path: `/transactions?tab=${1}`,
            breadcrumbName: "Transaction History",
          },
        ]);
      }
      setTab(parseInt(tabParam));
    } else {
      setBreadcrumbs([
        { path: "/transactions", breadcrumbName: "Transactions" },
      ]);
    }
  }, [location]);

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", newValue.toString());
    navigate({ search: searchParams.toString() });
  };
  const completeTransactions = transactions.filter(
    (transaction: any) => transaction.status === "completed"
  );
  const pendingTransactions = transactions.filter(
    (transaction: any) => transaction.status !== "completed"
  );
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      {!loading && (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="transaction tabs"
              style={{ padding: "0 20px" }}
            >
              <Tab label="My Offers" sx={{ textTransform: "none" }} />
              <Tab label="Transaction History" sx={{ textTransform: "none" }} />
            </Tabs>
          </Box>
          {tab === 0 && <Offers transactions={pendingTransactions} />}
          {tab === 1 && (
            <TransactionHistory transactions={completeTransactions} />
          )}
        </Box>
      )}
    </Layout>
  );
};

export default TransactionPage;
