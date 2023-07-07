import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { Listing } from "../Types";
import { UserContext } from "../Utils/UserProvider";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Layout from "../Components/Layout";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Circle,
} from "@react-google-maps/api";
import { LoadingScreen } from "../Components/LoadingScreen";
const mapContainerStyle = {
  width: "1000px",
  height: "400px",
};
const mapCenter = {
  lat: 43.653225, // Default coordinates (Toronto)
  lng: -79.383186,
};
const ListingDetailsPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, refreshToken } = useContext(UserContext);
  const [location, setLocation] = useState(mapCenter);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
  });
  useEffect(() => {
    const fetchListing = async () => {
      try {
        await refreshToken();
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/listing/${listingId}`,
          currentUser?.config
        );
        setBreadcrumbs([
          { path: "/", breadcrumbName: "Home" },
          {
            path: `/listing/${listingId}`,
            breadcrumbName: response.data.title,
          },
        ]);

        const listingData: Listing = response.data;
        const storage = getStorage();
        const formattedImages = await Promise.all(
          listingData.images.map(async (image) => {
            const imageRef = ref(storage, image);
            const imagePath = imageRef.fullPath;
            const downloadURL = await getDownloadURL(imageRef).catch(
              console.error
            );
            return { path: imagePath, url: downloadURL };
          })
        );
        const formattedSeller = { ...listingData.user };
        if (listingData.user.avatar) {
          const avatarRef = ref(storage, listingData.user.avatar as any);
          const avatarURL = await getDownloadURL(avatarRef).catch(
            console.error
          );
          formattedSeller.avatar = { url: avatarURL, path: avatarRef.fullPath };
        }
        const location = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/geocode/${encodeURIComponent(
            listingData?.location
          )}`,
          currentUser?.config
        );
        setLocation(location.data.results[0].geometry.location);
        setListing({
          ...listingData,
          user: formattedSeller,
          images: formattedImages,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading || !isLoaded || loadError || !listing) {
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
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Carousel>
                {listing.images.map((image: any, index: any) => (
                  <div key={index}>
                    <img
                      src={
                        typeof image.url === "string"
                          ? image.url
                          : URL.createObjectURL(image)
                      }
                      alt={`Image ${index + 1}`}
                    />
                  </div>
                ))}
              </Carousel>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardContent>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  onClick={() => {
                    navigate(`/profile/${listing.user._id}`);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <Grid item>
                    {listing.user.avatar ? (
                      <Avatar src={listing.user.avatar.url} alt="User Avatar" />
                    ) : (
                      <Avatar>{listing.user.username.charAt(0)}</Avatar>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {listing.user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Seller
                    </Typography>
                  </Grid>
                </Grid>
                <Typography gutterBottom variant="h5" component="div">
                  {listing.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.location}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                component={Link}
                disabled={
                  currentUser?.listings && currentUser?.listings?.length < 1
                }
                to={`/trade/${listing.user._id}`}
                style={{ margin: "10px" }}
              >
                Make Offer
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/listings"
                style={{ margin: "10px" }}
              >
                Back to Listings
              </Button>
            </Grid>
          </Grid>
        </Card>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={location}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={location} />
          <Circle
            center={location}
            radius={5000}
            options={{
              fillColor: "#0000FF",
              fillOpacity: 0.1,
              strokeWeight: 0,
            }}
          />
        </GoogleMap>
      </Box>
    </Layout>
  );
};
export default ListingDetailsPage;
