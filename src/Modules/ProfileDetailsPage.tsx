import { useState, useEffect, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import Layout from "../Components/Layout";
import { useParams } from "react-router-dom";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { LoadingScreen } from "../Components/LoadingScreen";
import axios from "axios";
import { UserContext } from "../Utils/UserProvider";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import ListingCard from "../Components/ListingCard";
import { useNavigate } from "react-router-dom";
import { ConversationsContext } from "../Utils/ConversationProvider";

const ProfileDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { sendMessage } = useContext(ConversationsContext);
  const { currentUser, refreshToken } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await refreshToken();
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/user/details/${userId}`,
          currentUser?.config
        );
        const userInfo = response.data;
        const storage = getStorage();
        const storageRef = ref(storage, userInfo.avatar as any);
        const url = await getDownloadURL(storageRef);
        setBreadcrumbs([
          { path: "/", breadcrumbName: "Home" },
          {
            path: `/transaction/${userId}`,
            breadcrumbName: `${response.data.username}`,
          },
        ]);
        const formattedListings = await Promise.all(
          userInfo.listings.map(async (listing: { images: string[] }) => {
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
        setUser({
          ...userInfo,
          listings: formattedListings,
          avatar: { url, path: storageRef.fullPath },
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch user:", error);
        // Optional: Handle the error or display an error message
      }
    };
    fetchUser();
  }, [location]);
  const handleMessageSubmit = () => {
    if (user.uid && user.uid !== currentUser?.uid) {
      sendMessage(message, user.uid);
      setOpen(false);
      setMessage("");
    }
  };
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <Box sx={{ width: "calc(100%-40px)", padding: "20px" }}>
        {user?.avatar ? (
          <Avatar
            src={user.avatar.url}
            alt="Profile"
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              margin: "0 auto",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              margin: "0 auto",
            }}
          >
            {user?.username.charAt(0)}
          </Avatar>
        )}
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {user?.username}
        </Typography>
        {currentUser?._id !== user?._id && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Send Message
            </Button>
          </Box>
        )}

        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Their Listings:
        </Typography>
        <Grid container spacing={2}>
          {user?.listings.map((listing: any) => (
            <Grid item key={listing._id} md={2}>
              <ListingCard
                title={listing.title}
                description={listing.description}
                location={listing.location}
                images={listing.images}
                onClick={() => navigate(`/listing/${listing._id}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Send a message to {user?.username}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            maxRows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleMessageSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ProfileDetailsPage;
