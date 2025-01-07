import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import { ArrowBack, ArrowForward, Delete } from "@mui/icons-material";

const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist trips
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Tracks current page
  const tripsPerPage = 3; // Number of trips to display per page
  const { user } = useAuth();

  // Fetch wishlist when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const user_id = user.id;

        if (!user_id) {
          setErrorMessage("User not logged in.");
          return;
        }

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
  }, [user.id]);

  // Calculate visible trips based on the current page
  const visibleTrips = wishlist.slice(
    currentPage * tripsPerPage,
    (currentPage + 1) * tripsPerPage
  );

  // Check if navigation is possible
  const canGoBack = currentPage > 0;
  const canGoForward = (currentPage + 1) * tripsPerPage < wishlist.length;

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
      const response = await axios.get(
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
    <Box sx={{ padding: "20px" }}>
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
            {visibleTrips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip.wish_id}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {trip.wish_name}
                      </Typography>
                      {/* Trash Button */}
                      <IconButton
                        onClick={() => handleDelete(trip.wish_id)}
                        aria-label="Delete"
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Destination:</strong> {trip.destination}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Travel Dates:</strong> {trip.start_range} -{" "}
                      {trip.end_range}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Genre:</strong> {trip.trip_genre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Budget:</strong> ${trip.budget}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Recommendation:</strong> {trip.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Travelers:</strong> {trip.travellers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Notes:</strong> {trip.notes}
                    </Typography>
                  </CardContent>
                </Card>
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
            <Typography variant="body2">
              Page {currentPage + 1} of {Math.ceil(wishlist.length / tripsPerPage)}
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
        <Typography variant="h6" align="center">
          Your wishlist is empty.
        </Typography>
      )}
    </Box>
  );
};

export default MyWishList;
