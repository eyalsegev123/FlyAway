import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  CircularProgress,
  Grid,
  Box,
  Alert,
} from "@mui/material";
import WishCardButton from "../components/WishCardButton";
import SearchBox from "../components/SearchBox";
const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist items
  const [originalWishlist, setOriginalWishlist] = useState([]); // Add this state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();

  // Fetch wishlist items
  const fetchWishlist = useCallback(async () => {
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
        setOriginalWishlist(response.data); // Store original wishlist
      }
    } catch (err) {
      setErrorMessage("An error occurred while fetching the wishlist.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch wishlist when the component mounts
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

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

  const handleEdit = async (wish_id, wish_name, wish_notes) => {
    try {
      // Send edit request to the backend
      const response = await axios.post(
        `http://localhost:5001/api/wishesRoutes/editWish/${wish_id}`,
        { wish_name, wish_notes }
      );
      if (response.status === 200) {
        fetchWishlist();
      } else {
        setErrorMessage("Failed to edit the wish.");
      }
    } catch (err) {
      setErrorMessage(`An error occurred while editing the wish: ${err.message}`);
    }
  };

  return (
    <Box sx={{ padding: "20px", marginTop: "100px" }}>
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
          <Box sx={{ marginBottom: "20px" }}>
            <SearchBox
              wishlist={wishlist}
              setWishlist={setWishlist}
              originalWishlist={originalWishlist}
            />
          </Box>
          <Box sx={{ 
            maxHeight: "80vh", 
            overflowY: "auto",
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            '-ms-overflow-style': 'none',  // IE and Edge
            'scrollbarWidth': 'none',  // Firefox
          }}>
            <Grid container spacing={3}>
              {wishlist.map((wish) => (
                <Grid item xs={12} sm={6} md={3} key={wish.wish_id}>
                  {/* Set width to 3 columns (1/4 of the row for 4 items per row) */}
                  <WishCardButton
                    wish={wish}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        
      ) : (
        <Alert
          severity="info"
          sx={{
            justifyContent: "center",
            width: "auto",
            maxWidth: "400px",
            textAlign: "center",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            height: "10vh",
          }}
        >
          Your WishList is Empty
        </Alert>
      )}
    </Box>
  );
};

export default MyWishList;
