import { useEffect, useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { UserContext } from "../Utils/UserProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { Paper, Grid, Typography } from "@mui/material";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Settings = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { currentUser, setLoading } = useContext(UserContext);

  useEffect(() => {
    if (currentUser && currentUser?.avatar) {
      const fetchImage = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, currentUser.avatar as any);
        const url = await getDownloadURL(storageRef);
        setSelectedImage({ url, path: storageRef.fullPath });
      };
      fetchImage();

      setSelectedImage(currentUser?.avatar);
    }
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const updateProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/api/user/${currentUser?.uid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: currentUser?.config?.headers.Authorization,
          },
        }
      );

      setLoading((prev) => !prev);
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      toast.error("Failed to upload profile image");
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      if (typeof selectedImage === "object" && selectedImage.url) {
        // Update existing image
        setSelectedImage(null);
        updateProfilePicture(selectedImage);
        toast.success("Profile image successfully removed!");
      } else {
        // Add new image
        const file = selectedImage;
        updateProfilePicture(file);
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, mt: 3, background: "transparent" }}>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt="Profile"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 150 }} />
            )}
            <input
              accept="image/jpeg"
              id="upload-profile-picture"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="upload-profile-picture">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                startIcon={<AccountCircleIcon />}
                sx={{ mt: 2 }}
              >
                {selectedImage
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"}
              </Button>
            </label>
            {selectedImage && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2 }}
              >
                Update Picture
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item lg={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <TextField
              label="Email"
              value={currentUser ? currentUser.email : ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="medium"
              sx={{
                minWidth: "30%",
                margin: "auto",
              }}
            />
          </Box>
        </Grid>
        <Grid item lg={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <TextField
              label="Username"
              value={currentUser ? currentUser.username : ""}
              InputProps={{ readOnly: true }}
              variant="outlined"
              size="medium"
              sx={{
                minWidth: "30%",
                margin: "auto",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Settings;
