import { useState, useEffect, useContext } from "react";
import Layout from "../Components/Layout";
import { Grid, TextField, Box } from "@mui/material";
import ListingCard from "../Components/ListingCard";
import axios from "axios";
import { Listing } from "../Types";
import { UserContext } from "../Utils/UserProvider";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "../Utils/BreadcrumbProvider";
import { LoadingScreen } from "../Components/LoadingScreen";

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useContext(UserContext);
  const { setBreadcrumbs } = useContext(BreadcrumbContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (currentUser) {
          setBreadcrumbs([{ path: "/", breadcrumbName: "Home" }]);
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/listing/others/${
              currentUser._id
            }`,
            currentUser?.config
          );
          const storage = getStorage();
          const listings = response.data;
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
          setListings(formattedListings);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) return <LoadingScreen />;
  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      <Grid container spacing={3} padding={"20px"}>
        {filteredListings?.map((listing) => (
          <Grid item key={listing._id} xs={12} sm={6} md={4} lg={3}>
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
    </Layout>
  );
};

export default HomePage;
