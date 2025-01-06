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
} from "@mui/material";

const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist trips
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        <Grid container spacing={3}>
          {wishlist.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.wish_id}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {trip.wish_name}
                  </Typography>
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
      ) : (
        <Typography variant="h6" align="center">
          Your wishlist is empty.
        </Typography>
      )}
    </Box>
  );
};

export default MyWishList;
