import React, { useState, useEffect } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AddTripForm from "../components/AddTripForm";
import Modal from "../components/Modal"; // Add Modal import
import SearchBox from "../components/SearchBox";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchTripsErrorMessage, setFetchTripsErrorMessage] = useState("");
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  // for successful trip add, edit or delete
  const [successMessage, setSuccessMessage] = useState("");

  const { user } = useAuth();
  const user_id = user?.id;

  const openAddTripModal = () => setIsAddTripModalOpen(true);
  const closeAddTripModal = () => setIsAddTripModalOpen(false);

  useEffect(() => {
    if (!user_id) return;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        if (!user_id) {
          setFetchTripsErrorMessage("User not logged in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/tripsRoutes/getUserTrips/${user_id}`
        );
        if (response.status === 200) {
          setTrips(response.data);
        }
      } catch (err) {
        setFetchTripsErrorMessage("An error occurred while getting the trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user_id]);

  const handleTripAdded = (newTrip) => {
    setTrips([...trips, newTrip]);
    closeAddTripModal(); // Close modal after successful addition
    setSuccessMessage("Trip added successfully!");
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="trips-container">
      {fetchTripsErrorMessage && (
        <p className="error">{fetchTripsErrorMessage}</p>
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

      <SearchBox 
        array={trips}
        setArray={setTrips}
        originalArray={trips}
        searchKey="trip_name"
        placeholder="Search trips..."
      />
      <div className="trips-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <h3>{trip.tripName}</h3>
            <p>{trip.destination}</p>
            <p>
              {trip.startDate} - {trip.endDate}
            </p>
            <p>Rating: {trip.stars} ★</p>
            <p>Review: {trip.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;
