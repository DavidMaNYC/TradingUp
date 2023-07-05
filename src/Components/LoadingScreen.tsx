import Layout from "./Layout";
import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingScreen = () => {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          color: "primary.main",
        }}
      >
        <CircularProgress size={60} color="inherit" />
        <Typography variant="h6" color="inherit" sx={{ marginTop: 2 }}>
          Loading...
        </Typography>
      </Box>
    </Layout>
  );
};
