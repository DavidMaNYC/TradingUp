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

const CounterOfferPage = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const [open, setOpen] = useState(false);
  const [otherUserItems, setOtherUserItems] = useState<Listing[]>([]);
  const [mySelectedItems, setMySelectedItems] = useState<string[]>([]);
  const [theirSelectedItems, setTheirSelectedItems] = useState<string[]>([]);
  const [offer, setOffer] = useState<any>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const otherUser =
        offer.createdBy._id !== currentUser?._id
          ? offer.createdBy._id
          : offer.targetUser._id;
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
        {
          createdBy: currentUser?._id,
          offers: mySelectedItems,
          demands: theirSelectedItems,
          targetUser: otherUser,
          status: "countered",
          turn: otherUser,
        },
        currentUser?.config
      );
      handleClose();
      navigate("/transaction");
    } catch (error) {
      console.error("Failed to confirm trade:", error);
    }
  };

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!currentUser) return;
      try {
        const offerResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/offer/${offerId}`,
          currentUser?.config
        );
        const offer = offerResponse.data;
        let otherUser;
        if (offer.createdBy._id !== currentUser._id) {
          otherUser = offer.createdBy;
        } else if (offer.targetUser._id !== currentUser._id) {
          otherUser = offer.targetUser;
        }
        setTheirSelectedItems(offer.offers.map((item: any) => item._id));
        setMySelectedItems(offer.demands.map((item: any) => item._id));
        setOffer(offer);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/listing/user/${
            otherUser._id
          }`,
          currentUser?.config
        );
        setBreadcrumbs([
          { path: "/", breadcrumbName: "Home" },
          { path: "/counter", breadcrumbName: "Counter Offer" },
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

  const handleMyItemsClick = (itemId: string) => {
    setMySelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleTheirItemsClick = (itemId: string) => {
    setTheirSelectedItems((prev) =>
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
                      selected={mySelectedItems.includes(item._id || "")}
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
                      selected={theirSelectedItems.includes(item._id || "")}
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
            mySelectedItems.length === 0 || theirSelectedItems.length === 0
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

export default CounterOfferPage;
