import React, { useState } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import Header from "../components/Header";

const MyTrips = () => {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [photos, setPhotos] = useState(null);
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false); // Manage form visibility
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const newTrip = {
        tripName,
        destination,
        startDate,
        endDate,
        photos,
      };

      // Send the data to the backend using axios
      const response = await axios.post(
        `http://localhost:5001/api/trips`, // Backend endpoint to save the trip
        newTrip
      );

      if (response.status === 200) {
        // If the trip was added successfully, update the trips list
        setTrips([...trips, response.data.trip]);
        setShowForm(false); // Hide form after submitting
      }
    } catch (err) {
      setErrorMessage("An error occurred while submitting the trip details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trips-container">
      <Header />
      <button onClick={() => setShowForm(true)} className="add-trip-button">
        +
      </button>

      {showForm && (
        <div className="trip-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Trip Name"
              required
            />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              required
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={(e) => setPhotos(e.target.files)}
              multiple
            />
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Trip"}
            </button>
          </form>
        </div>
      )}

      <div className="trips-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <h3>{trip.tripName}</h3>
            <p>{trip.destination}</p>
            <p>
              {trip.startDate} - {trip.endDate}
            </p>
          </div>
        ))}
      </div>

      {errorMessage && <div className="error-message-mytrip">{errorMessage}</div>}
    </div>
  );
};

export default MyTrips;
