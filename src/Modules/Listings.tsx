import { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GooglePlacesAutocomplete from "react-google-autocomplete";
import axios from "axios";
import ListingCard from "../Components/ListingCard";
import "./Listings.css";
import { Listing } from "../Types";
import { toast } from "react-toastify";
import { UserContext } from "../Utils/UserProvider";

const Listings = () => {
  const { currentUser, setLoading } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    images: [],
  });

  const handleListingClick = (listing: any) => {
    setFormData({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      images: listing.images,
    });
    setSelectedListing(listing);
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      images: files,
    }));
  };

  const handleDeleteImage = (index: number) => {
    setFormData((prevFormData) => {
      const imagesCopy = [...prevFormData.images];
      imagesCopy.splice(index, 1);
      return {
        ...prevFormData,
        images: imagesCopy,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentUser && currentUser._id) {
        const listingData = new FormData();
        listingData.append("user", currentUser._id);
        listingData.append("title", formData.title);
        listingData.append("description", formData.description);
        listingData.append("location", formData.location);

        formData.images.forEach((image: any) => {
          if (typeof image?.path === "string") {
            listingData.append("image", image.path);
          } else {
            listingData.append("image", image);
          }
        });

        if (selectedListing) {
          // If there is a selectedListing, update it
          await axios.patch(
            `${import.meta.env.VITE_APP_API_URL}/api/listing/${
              selectedListing._id
            }`,
            listingData,
            {
              headers: {
                Authorization: currentUser.config?.headers.Authorization,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Listing updated successfully", {
            toastId: "successListing1",
          });
        } else {
          // If there is no selectedListing, create a new one
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/api/listing`,
            listingData,
            {
              headers: {
                Authorization: currentUser.config?.headers.Authorization,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Listing updated successfully", {
            toastId: "successListing2",
          });
        }
        setLoading((prev) => !prev);
        handleClose();
      } else {
        toast.error("Failed to create listing", {
          toastId: "failedListing1",
        });
      }
    } catch (error) {
      toast.error("Failed to create listing:", {
        toastId: "failedListing2",
      });
    }
  };

  const handlePlaceSelect = (place: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: place.formatted_address || "",
    }));
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: 1,
          width: "25ch",
        },
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      noValidate
      autoComplete="off"
    >
      <Button
        variant="outlined"
        sx={{ textTransform: "none" }}
        color="primary"
        onClick={handleClickOpen}
      >
        Create Listing
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle sx={{ textAlign: "center" }} id="form-dialog-title">
          {selectedListing ? "Edit Listing" : "Create a New Listing"}
        </DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            width: "500px",
            flexDirection: "column",
            gap: "10px",
            padding: "20px",
          }}
        >
          <TextField
            autoFocus
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={2}
            maxRows={4}
            required
          />
          <div style={{ position: "relative" }}>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
              style={{
                zIndex: 100000,
                width: "470px",
                height: "23px",
                fontSize: "1em",
                padding: "16.5px 14px",
                borderRadius: "4px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
              }}
              autocompletionRequest={{
                types: ["(cities)"],
              }}
              options={{
                disableLogo: true,
              }}
              onPlaceSelected={handlePlaceSelect}
              defaultValue={formData.location}
            />
          </div>
          <input
            accept="image/jpeg"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            multiple
            onChange={handleImageChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Images
            </Button>
          </label>
          <Grid container spacing={2}>
            {formData.images.map((image: any, index: number) => (
              <Grid item key={index}>
                <div style={{ position: "relative" }}>
                  <img
                    src={
                      typeof image.url === "string"
                        ? image.url
                        : URL.createObjectURL(image)
                    }
                    alt={`Image ${index + 1}`}
                    style={{ width: "150px", height: "150px" }}
                  />
                  <IconButton
                    aria-label="Delete"
                    onClick={() => handleDeleteImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      zIndex: 1,
                      background: "#fff",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedListing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        {currentUser?.listings.map((listing) => (
          <Grid item key={listing._id}>
            <ListingCard
              title={listing.title}
              description={listing.description}
              location={listing.location}
              images={listing.images}
              onClick={() => handleListingClick(listing)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Listings;
