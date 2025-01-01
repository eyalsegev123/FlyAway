import React, { useState, useEffect } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import Header from "../components/Header";


const MyTrips = () => {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [photos, setPhotos] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false); // Manage form visibility
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  // Fetch trips when the component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        // Retrieve the user_id from localStorage
          const user_id = localStorage.getItem("user_id");

          if (!user_id) {
            setErrorMessage("User not logged in.");
            return;
          }

        const response = await axios.get(
          `http://localhost:5001/tripsRoutes/getUserTrips${user_id}`
        );
        if (response.status === 200) {
          setTrips(response.data);  // Update state with the trips data
        }
      } catch (err) {
        setErrorMessage("An error occurred while getting the trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []); 
 

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
        stars,
        review,
      };

      // Send the data to the backend using axios
      const response = await axios.post(
        `http://localhost:5001/tripsRoutes/addTrip`, // Backend endpoint to save the trip
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

  // Handle star selection
  const handleStarClick = (value) => {
    setStars(value);
  };

  // Function to close the form
  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="trips-container">
      <Header />
      <button onClick={() => setShowForm(true)} className="add-trip-button">
        +
      </button>

      {showForm && (
        <div className="mytrip-form">
          <button className="mytrips-close-button" onClick={closeForm}>X</button>
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
            <label>
              Upload Your Trip Photos:
              <input
                type="file"
                onChange={(e) => setPhotos(e.target.files)}
                multiple
              />
            </label>
            <div className="stars-container">
              <label>Rate Your Trip:   </label>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <span
                    key={index + 1}
                    className={`star ${index + 1 <= stars ? "selected" : ""}`}
                    onClick={() => handleStarClick(index + 1)}
                  >
                    ★
                  </span>
                ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review about the trip"
              rows="4"
              required
            ></textarea>
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
            <p>Rating: {trip.stars} ★</p>
            <p>Review: {trip.review}</p>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="error-message-mytrip">{errorMessage}</div>
      )}
    </div>
  );
};

export default MyTrips;
