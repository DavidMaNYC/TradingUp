import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../Utils/UserProvider";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Layout from "../Components/Layout";
import { useParams } from "react-router-dom";
import { LoadingScreen } from "../Components/LoadingScreen";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";

const TransactionDetailsPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const { currentUser, refreshToken } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const handleAccept = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
        {
          status: "accepted",
        },
        currentUser?.config
      );
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
    }
  };
  const handleDecline = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
        {
          status: "declined",
        },
        currentUser?.config
      );
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
    }
  };
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!currentUser || !currentUser._id) {
        return;
      }
      try {
        await refreshToken();
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
          currentUser?.config
        );
        setBreadcrumbs([
          { path: "/", breadcrumbName: "Home" },
          {
            path: `/transaction/${offerId}`,
            breadcrumbName: "Transaction Details",
          },
        ]);

        const formattedOffers = await Promise.all(
          response.data.offers.map(async (offer: any) => {
            const formattedImages = await Promise.all(
              offer.images.map(async (image: string) => {
                try {
                  const imageRef = ref(storage, image);
                  const downloadURL = await getDownloadURL(imageRef);
                  return { path: image, url: downloadURL };
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
          response.data.demands.map(async (demand: any) => {
            const formattedImages = await Promise.all(
              demand.images.map(async (image: string) => {
                try {
                  const imageRef = ref(storage, image);
                  const downloadURL = await getDownloadURL(imageRef);
                  return { path: image, url: downloadURL };
                } catch (error) {
                  console.error("Failed to fetch image:", error);
                  return null;
                }
              })
            );
            return { ...demand, images: formattedImages };
          })
        );
        let formattedUser;
        if (response.data.createdBy._id !== currentUser._id) {
          const storageRef = ref(
            storage,
            response.data.createdBy.avatar as any
          );
          const url = await getDownloadURL(storageRef);
          formattedUser = {
            ...response.data.createdBy,
            avatar: { url, path: storageRef.fullPath },
          };
        } else if (response.data.targetUser._id !== currentUser._id) {
          if (!response.data.targetUser.avatar) {
            formattedUser = {
              ...response.data.targetUser,
              avatar: null,
            };
          } else {
            const storageRef = ref(
              storage,
              response.data.targetUser.avatar as any
            );
            const url = await getDownloadURL(storageRef);
            formattedUser = {
              ...response.data.targetUser,
              avatar: { url, path: storageRef.fullPath },
            };
          }
        }
        setOtherUser(formattedUser);
        setTransaction({
          ...response.data,
          offers: formattedOffers,
          demands: formattedDemands,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
        setLoading(false);
      }
    };

    const storage = getStorage();
    fetchTransaction();
  }, [offerId, currentUser, setBreadcrumbs]);

  const handleOpenDialog = (listing: any) => {
    setSelectedListing(listing);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ maxWidth: 1000, width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography gutterBottom variant="h5" component="div">
                Transaction Details
              </Typography>
              <Box
                onClick={() => {
                  navigate(`/profile/${otherUser._id}`);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {otherUser && otherUser.avatar ? (
                  <>
                    <Avatar
                      src={otherUser.avatar.url}
                      sx={{ marginRight: "10px" }}
                    />
                    <Typography variant="body2">
                      {otherUser.username}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Avatar sx={{ marginRight: "10px" }}>
                      {otherUser.username.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {otherUser.username}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created Date: {new Date(transaction.createdAt).toLocaleString()}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Offers</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {transaction.offers.map((offer: any, index: number) => (
                  <Card
                    key={`${offer._id}_${index}`}
                    sx={{
                      width: "100px",
                      height: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenDialog(offer)}
                  >
                    <img
                      src={offer.images[0]?.url}
                      alt={`Offer Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Demands</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {transaction.demands.map((demand: any, index: number) => (
                  <Card
                    key={`${demand._id}_${index}`}
                    sx={{
                      width: "100px",
                      height: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenDialog(demand)}
                  >
                    <img
                      src={demand.images[0]?.url}
                      alt={`Demand Image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                ))}
              </Box>
            </Box>
            {transaction?.turn === currentUser?._id &&
            (transaction.status === "pending" ||
              transaction.status === "countered") ? (
              <Box
                sx={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Button
                  onClick={handleAccept}
                  variant="contained"
                  color="primary"
                >
                  Accept Offer
                </Button>
                <Button
                  onClick={handleDecline}
                  variant="contained"
                  color="error"
                >
                  Decline Offer
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(`/counter/${offerId}`)}
                >
                  Make Counter Offer
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(`/transaction`)}
                >
                  Go Back
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {selectedListing && (
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogContent>
              <Typography gutterBottom variant="h6">
                {selectedListing.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedListing.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Carousel>
                  {selectedListing.images.map((image: any, index: number) => (
                    <div key={index}>
                      <img src={image.url} alt={`Image ${index + 1}`} />
                    </div>
                  ))}
                </Carousel>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Layout>
  );
};

export default TransactionDetailsPage;
