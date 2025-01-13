import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import WishCardButton from "../components/WishCardButton";

const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist items
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Tracks current page
  const wishesPerPage = 3; // Number of wishes to display per page
  const { user } = useAuth();

  // Fetch wishlist when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setErrorMessage(""); // Reset error message

      if (!user || !user.id) {
        setLoading(false);
        setErrorMessage("User not logged in.");
        return;
      }
      const user_id = user?.id;

      try {
        // Fetch wishlist items for the user
        const response = await axios.get(
          `http://localhost:5001/api/wishesRoutes/getUserWishes/${user_id}`
        );

        if (response.status === 200) {
          setWishlist(response.data); // Set the wishlist state
        }
      } catch (err) {
        setErrorMessage("An error occurred while fetching the wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Calculate visible wishes based on the current page
  const visibleWishes = wishlist.slice(
    currentPage * wishesPerPage,
    (currentPage + 1) * wishesPerPage
  );

  // Check if navigation is possible
  const canGoBack = currentPage > 0;
  const canGoForward = (currentPage + 1) * wishesPerPage < wishlist.length;

  // Handle page navigation
  const handleNext = () => {
    if (canGoForward) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (canGoBack) setCurrentPage((prevPage) => prevPage - 1);
  };

  // Handle deleting a wish
  const handleDelete = async (wish_id) => {
    try {
      // Send delete request to the backend
      const response = await axios.delete(
        `http://localhost:5001/api/wishesRoutes/deleteWish/${wish_id}`
      );

      if (response.status === 200) {
        // Remove the wish from the frontend state
        setWishlist((prevWishlist) =>
          prevWishlist.filter((wish) => wish.wish_id !== wish_id)
        );
      } else {
        setErrorMessage("Failed to delete the wish.");
      }
    } catch (err) {
      setErrorMessage("An error occurred while deleting the wish.");
    }
  };

  return (
    <Box sx={{ padding: "20px", marginTop: "100px" }}>
      {" "}
      {/* Updated sx prop */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : wishlist.length > 0 ? (
        <Box>
          <Grid container spacing={3}>
            {visibleWishes.map((wish) => (
              <Grid item xs={12} sm={6} md={4} key={wish.wish_id}>
                <WishCardButton wish={wish} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>

          {/* Navigation Arrows */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <IconButton
              onClick={handlePrevious}
              disabled={!canGoBack}
              aria-label="Previous"
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: "white" }} // Replace "blue" with your desired color
            >
              Page {currentPage + 1} of{" "}
              {Math.ceil(wishlist.length / wishesPerPage)}
            </Typography>
            <IconButton
              onClick={handleNext}
              disabled={!canGoForward}
              aria-label="Next"
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Alert
          severity="info"
          sx={{
            justifyContent: "center",
            width: "auto", // Adjust width based on content
            maxWidth: "400px", // Limit the maximum width
            textAlign: "center", // Center the text inside the alert
            margin: "auto", // Center horizontally and vertically
            display: "flex",
            alignItems: "center",
            height: "10vh", // Adjust height to ensure vertical centering
          }}
        >
          Your WishList is Empty
        </Alert>
      )}
    </Box>
  );
};

export default MyWishList;
