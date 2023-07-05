import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Layout from "../Components/Layout";
import { useParams } from "react-router-dom";
import { UserContext } from "../Utils/UserProvider";
import ListingCard from "../Components/ListingCard";
import axios from "axios";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Listing } from "../Types";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { useNavigate } from "react-router-dom";

const TradeScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/offer`,
        {
          createdBy: currentUser?._id,
          offers: selectedMyItems,
          demands: selectedTheirItems,
          status: "pending",
          targetUser: id,
        },
        currentUser?.config
      );
      handleClose();
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
      // Optional: Handle the error or display an error message
    }
  };

  const [otherUserItems, setOtherUserItems] = useState<Listing[]>([]);
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/listing/user/${id}`,
          currentUser?.config
        );
        setBreadcrumbs([
          { path: "/", breadcrumbName: "Home" },
          { path: "/trade", breadcrumbName: "New Offer" },
        ]);

        const listings = response.data;
        const storage = getStorage();
        const formattedListings = await Promise.all(
          listings.map(async (listing: { images: string[] }) => {
            const formattedImages = await Promise.all(
              listing.images.map(async (image) => {
                const imageRef = ref(storage, image);
                const imagePath = imageRef.fullPath; // Get the full path of the image
                const downloadURL = await getDownloadURL(imageRef).catch(
                  console.error
                );
                return { path: imagePath, url: downloadURL };
              })
            );
            return {
              ...listing,
              images: formattedImages,
            };
          })
        );
        setOtherUserItems(formattedListings);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserListings();
  }, []);
  const [selectedMyItems, setSelectedMyItems] = useState<string[]>([]);
  const [selectedTheirItems, setSelectedTheirItems] = useState<string[]>([]);

  const handleMyItemsClick = (itemId: string) => {
    setSelectedMyItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleTheirItemsClick = (itemId: string) => {
    setSelectedTheirItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: "50%",
              margin: "10px",
              borderRadius: "4px",
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Your Items
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-around",
                }}
              >
                {currentUser?.listings.map((item) => (
                  <div key={item._id}>
                    <ListingCard
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      location={item.location}
                      images={item.images}
                      selected={selectedMyItems.includes(item._id || "")}
                      onClick={() => {
                        if (item._id) handleMyItemsClick(item._id);
                      }}
                      selectable={true}
                    />
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              maxWidth: 600,
              width: "50%",
              margin: "10px",
              borderRadius: "4px",
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Their Items
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "space-around",
                }}
              >
                {otherUserItems?.map((item) => (
                  <div key={item._id}>
                    <ListingCard
                      id={item._id}
                      title={item.title}
                      description={item.description}
                      location={item.location}
                      images={item.images}
                      selected={selectedTheirItems.includes(item._id || "")}
                      onClick={() => {
                        if (item._id) handleTheirItemsClick(item._id);
                      }}
                      selectable={true}
                    />
                  </div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Button
          variant="contained"
          style={{ margin: "10px" }}
          onClick={handleClickOpen}
          disabled={
            selectedMyItems.length === 0 || selectedTheirItems.length === 0
          }
        >
          Confirm Trade
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Trade"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to confirm this trade?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default TradeScreen;
