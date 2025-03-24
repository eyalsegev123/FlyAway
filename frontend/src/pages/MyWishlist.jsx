import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Grid, Box, Alert, Snackbar } from "@mui/material";
import WishCardButton from "../components/WishCardButton";
import SearchBox from "../components/SearchBox";
import ConfirmationDialog from "../components/ConfimrationDialog";
import apiService from "../utils/api";

const MyWishList = () => {
  const [wishlist, setWishlist] = useState([]); // State to store wishlist items
  const [originalWishlist, setOriginalWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isVisible: false,
    wishId: null,
    wishName: "",
  });

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
      const response = await apiService.getUserWishes(user_id);

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

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const showAlert = (message, severity) => {
    setAlertInfo({
      open: true,
      message,
      severity,
    });
  };

  // Modified handleDelete function to show confirmation dialog
  const handleDelete = async (wish_id) => {
    // Find the wish name for the confirmation message
    const wishToDelete = wishlist.find((wish) => wish.wish_id === wish_id);

    // Show the confirmation dialog
    setDeleteConfirmation({
      isVisible: true,
      wishId: wish_id,
      wishName: wishToDelete ? wishToDelete.wish_name : "this wish",
    });
  };

  // Add these new functions to handle confirmation result
  const confirmDelete = async () => {
    try {
      // Send delete request to the backend
      const response = await apiService.deleteWish(deleteConfirmation.wishId);

      if (response.status === 200) {
        // Remove the wish from the frontend state
        setWishlist((prevWishlist) =>
          prevWishlist.filter(
            (wish) => wish.wish_id !== deleteConfirmation.wishId
          )
        );
        setOriginalWishlist((prevWishlist) =>
          prevWishlist.filter(
            (wish) => wish.wish_id !== deleteConfirmation.wishId
          )
        );
        showAlert("Wish removed successfully!", "success");
      } else {
        showAlert("Failed to delete the wish.", "error");
      }
    } catch (err) {
      showAlert(err.message || "Failed to delete wish", "error");
    } finally {
      // Close the confirmation dialog
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isVisible: false,
      wishId: null,
      wishName: "",
    });
  };

  const handleEdit = async (wish_id, wish_name, wish_notes) => {
    try {
      // Send edit request to the backend
      const response = await apiService.editWish(wish_id, { wish_name, wish_notes });
      if (response.status === 200) {
        fetchWishlist();
        showAlert("Wish edited successfully!", "success");
      } else {
        setErrorMessage("Failed to edit the wish.");
      }
    } catch (err) {
      setErrorMessage(
        `An error occurred while editing the wish: ${err.message}`
      );
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
      ) : (
        <Box>
          <Box sx={{ marginBottom: "20px" }}>
            <SearchBox
              array={wishlist}
              setArray={setWishlist}
              originalArray={originalWishlist}
              searchKey="wish_name"
              placeholder="Search wishes..."
            />
          </Box>

          {originalWishlist.length > 0 ? (
            <Box
              sx={{
                maxHeight: "80vh",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none", // IE and Edge
                scrollbarWidth: "none", // Firefox
              }}
            >
              {wishlist.length > 0 ? (
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
                  No wishes match your search
                </Alert>
              )}
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
      )}

      {/* Add the confirmation dialog component */}
      <ConfirmationDialog
        isVisible={deleteConfirmation.isVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        tripName={deleteConfirmation.wishName}
        itemType="wish"
      />

      <Snackbar
        open={alertInfo.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "100px" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyWishList;
