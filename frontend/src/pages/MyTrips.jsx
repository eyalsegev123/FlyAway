import React, { useState, useEffect, useCallback } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AddTripForm from "../components/AddTripForm";
import Modal from "../components/Modal"; // Add Modal import
import SearchBox from "../components/SearchBox";
import TripCardButton from "../components/TripCardButton";
import PhotoCarousel from "../components/PhotoCarousel"; // Add PhotoCarousel import
import ConfirmationDialog from "../components/ConfimrationDialog";
import {
  CircularProgress,
  Grid,
  Box,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material"; // Add Snackbar import

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [originalTrips, setOriginalTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false); // state to control modal visibility
  const [albumPhotosURLs, setAlbumPhotosURLs] = useState([]); // state to hold photos from S3
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [review, setReview] = useState("");
  // for successful trip add, edit or delete
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isVisible: false,
    tripId: null,
    tripName: "",
  });

  const { user } = useAuth();
  const user_id = user?.id;

  const openAddTripModal = () => setIsAddTripModalOpen(true);
  const closeAddTripModal = () => setIsAddTripModalOpen(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    if (!user || !user.id) {
      setLoading(false);
      setAlertInfo("User not logged in.", "error");
      return;
    }
    const user_id = user?.id;
    try {
      const response = await axios.get(
        `http://localhost:5001/api/tripsRoutes/getUserTrips/${user_id}`
      );
      if (response.status === 200) {
        setTrips(response.data);
        setOriginalTrips(response.data);
      }
    } catch (err) {
      setAlertInfo("An error occurred while getting the trips", "error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleTripAdded = (newTrip) => {
    setTrips([ newTrip, ...trips]);
    setOriginalTrips([newTrip, ...originalTrips]);
    closeAddTripModal(); // Close modal after successful addition
    showAlert("Trip added successfully!", "success");
  };

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

  const handleCloseAlbum = () => {
    setIsAlbumOpen(false); // close the modal
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    setReview("");
  };

  const handleEdit = async (trip_id, formData) => {
    try {
      // Send edit request to the backend
      const response = await axios.post(
        `http://localhost:5001/api/tripsRoutes/editTrip/${trip_id}`,
        formData
      );
      if (response.status === 200) {
        fetchTrips();
        showAlert("Trip edited successfully!", "success");
      }
    } catch (err) {
      showAlert(err.message || "Failed to edit trip", "error");
    }
  };

  const handleDelete = async (trip_id) => {
    // Find the trip name for the confirmation message
    const tripToDelete = trips.find((trip) => trip.trip_id === trip_id);

    // Show the confirmation dialog
    setDeleteConfirmation({
      isVisible: true,
      tripId: trip_id,
      tripName: tripToDelete ? tripToDelete.trip_name : "this trip",
    });
  };

  const confirmDelete = async () => {
    try {
      // Send delete request to the backend
      const response = await axios.delete(
        `http://localhost:5001/api/tripsRoutes/deleteTrip/${deleteConfirmation.tripId}`
      );

      if (response.status === 200) {
        // Remove the trip from the frontend state
        setTrips((prevTrips) =>
          prevTrips.filter((trip) => trip.trip_id !== deleteConfirmation.tripId)
        );
        setOriginalTrips((prevTrips) =>
          prevTrips.filter((trip) => trip.trip_id !== deleteConfirmation.tripId)
        );
        showAlert("Trip deleted successfully!", "success");
      } else {
        showAlert("Failed to delete the trip.", "error");
      }
    } catch (err) {
      showAlert(err.message || "Failed to delete trip", "error");
    } finally {
      // Close the confirmation dialog
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isVisible: false,
      tripId: null,
      tripName: "",
    });
  };

  const fetchAlbumPhotosURLs = async (trip) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/tripsRoutes/fetchAlbum/${trip.trip_id}`
      );
      setAlbumPhotosURLs(response.data.photos); // assuming the response contains an array of photos
      setIsAlbumOpen(true); // open the modal
    } catch (error) {
      console.error("Error fetching album photos", error);
    }
  };

  const handleReview = async (trip) => {
    setIsReviewOpen(true);
    setReview(trip.review);
  };

  if (!user) {
    return <Alert> Loading user information...</Alert>;
  }

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
      ) : (
        <Box>
          {/* SearchBox moved outside conditional rendering to always be visible when not loading */}
          <Box sx={{ marginBottom: "20px" }}>
            <SearchBox
              array={trips}
              setArray={setTrips}
              originalArray={originalTrips}
              searchKey="trip_name"
              placeholder="Search trips..."
            />
          </Box>
          
          {originalTrips.length > 0 ? (
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
              {trips.length > 0 ? (
                <Grid container spacing={3}>
                  {trips.map((trip) => (
                    <Grid item xs={12} sm={6} md={3} key={trip.trip_id}>
                      <TripCardButton
                        trip={trip}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onAlbumPress={fetchAlbumPhotosURLs}
                        onReviewPress={handleReview}
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
                  No trips match your search
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
              Your trip list is Empty
            </Alert>
          )}
        </Box>
      )}
      <button onClick={openAddTripModal} className="add-trip-button">
        +
      </button>

      <Modal isOpen={isAddTripModalOpen} onClose={closeAddTripModal} title="">
        <AddTripForm onTripAdded={handleTripAdded} userId={user_id} />
      </Modal>

      <Modal
        isOpen={isAlbumOpen}
        onClose={handleCloseAlbum}
        title="Trip Album"
        children={<PhotoCarousel photos={albumPhotosURLs} />}
      ></Modal>

      <Modal isOpen={isReviewOpen} onClose={handleCloseReview} title={"Review"}>
        <Typography variant="body1" sx={{ color: "white" }}>
          {review || "No review added yet"}
        </Typography>
      </Modal>

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

      <ConfirmationDialog
        isVisible={deleteConfirmation.isVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        tripName={deleteConfirmation.tripName}
        itemType="trip"
      />
    </Box>
  );
};

export default MyTrips;
