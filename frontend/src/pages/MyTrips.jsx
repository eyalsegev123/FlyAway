import React, { useState, useEffect, useCallback } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AddTripForm from "../components/AddTripForm";
import Modal from "../components/Modal"; // Add Modal import
import SearchBox from "../components/SearchBox";
import TripCardButton from "../components/TripCardButton";
import {CircularProgress, Grid, Box, Alert, Snackbar} from "@mui/material"; // Add Snackbar import

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [originalTrips, setOiriginalTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  // for successful trip add, edit or delete
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { user } = useAuth();
  const user_id = user?.id;

  const openAddTripModal = () => setIsAddTripModalOpen(true);
  const closeAddTripModal = () => setIsAddTripModalOpen(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    if (!user || !user.id) {
        setLoading(false);
        setAlertInfo("User not logged in.", 'error');
        return;
      }
    const user_id = user?.id;  
    try {
      const response = await axios.get(
        `http://localhost:5001/api/tripsRoutes/getUserTrips/${user_id}`
      );
      if (response.status === 200) {
        setTrips(response.data);
        setOiriginalTrips(response.data);
      }
    } catch (err) {
      setAlertInfo("An error occurred while getting the trips", 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);


  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleTripAdded = (newTrip) => {
    setTrips([...trips, newTrip]);
    setOiriginalTrips([...originalTrips, newTrip]);
    closeAddTripModal(); // Close modal after successful addition
    showAlert('Trip added successfully!', 'success');
  };

  if (!user) {
    return <Alert> Loading user information...</Alert>;
  }

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const showAlert = (message, severity) => {
    setAlertInfo({
      open: true,
      message,
      severity
    });
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
        showAlert('Trip edited successfully!', 'success');
      }
    } catch (err) {
      showAlert(err.message || 'Failed to edit trip', 'error');
    }
  };


   const handleDelete = async (trip_id) => {
     try {
       // Send delete request to the backend
       const response = await axios.delete(
         `http://localhost:5001/api/tripsRoutes/deleteTrip/${trip_id}`
       );

       if (response.status === 200) {
         // Remove the trip from the frontend state
         setTrips((prevTrips) =>
           prevTrips.filter((trip) => trip.trip_id !== trip_id)
         );
         setOiriginalTrips((prevTrips) =>
          prevTrips.filter((trip) => trip.trip_id !== trip_id)
        );
         showAlert('Trip deleted successfully!', 'success');
       } else {
         setAlertInfo("Failed to delete the trip.", 'error');
       }
     } catch (err) {
       showAlert(err.message || 'Failed to delete trip', 'error');
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
      ) 
      : trips.length > 0 ? (
        <Box>
          <Box sx={{ marginBottom: "20px" }}>
            <SearchBox 
              array={trips}
              setArray={setTrips}
              originalArray={originalTrips}
              searchKey="trip_name"
              placeholder="Search trips..."
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
              {trips.map((trip) => (
                <Grid item xs={12} sm={6} md={3} key={trip.trip_id}>
                  {/* Set width to 3 columns (1/4 of the row for 4 items per row) */}
                  <TripCardButton
                    trip={trip}
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
          Your trip list is Empty
        </Alert>
      )}
      <button onClick={openAddTripModal} className="add-trip-button">
        +
      </button>

      <Modal 
        isOpen={isAddTripModalOpen} 
        onClose={closeAddTripModal} 
        title=""
      >
        <AddTripForm
          onTripAdded={handleTripAdded}
          userId={user_id}
        />
      </Modal>

      <Snackbar 
        open={alertInfo.open} 
        autoHideDuration={3000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertInfo.severity}
          sx={{ width: '100%' }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyTrips;





