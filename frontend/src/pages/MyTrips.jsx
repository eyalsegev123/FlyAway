import React, { useState, useEffect } from "react";
import "../styles/pages/MyTrips.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

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
  const [fetchTripsErrorMessage, setFetchTripsErrorMessage] = useState("");
  const [submitTripErrorMessage, setSubmitTripErrorMessage] = useState("");
  const { user } = useAuth();
  const user_id = user?.id; // Safely access user.id

  // Fetch trips when the component mounts
  useEffect(() => {
    if (!user_id) return; // Wait until user_id is available

    const fetchTrips = async () => {
      setLoading(true);
      try {
        // Retrieve the user_id from localStorage

        if (!user_id) {
          setFetchTripsErrorMessage("User not logged in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/tripsRoutes/getUserTrips/${user_id}`
        );
        if (response.status === 200) {
          setTrips(response.data); // Update state with the trips data
        }
      } catch (err) {
        setFetchTripsErrorMessage("An error occurred while getting the trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user_id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitTripErrorMessage("");

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
        `http://localhost:5001/api/tripsRoutes/addTrip/${user_id}`, // Backend endpoint to save the trip
        newTrip
      );

      if (response.status === 201) {
        // If the trip was added successfully, update the trips list
        setTrips([...trips, response.data.trip]);
        setShowForm(false); // Hide form after submitting
      }
    } catch (err) {
      setSubmitTripErrorMessage(
        "An error occurred while submitting the trip details."
      );
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

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="trips-container">
      {fetchTripsErrorMessage && (
        <p className="error">{fetchTripsErrorMessage}</p>
      )}

      <button onClick={() => setShowForm(true)} className="add-trip-button">
        +
      </button>

      {showForm && (
        <div className="mytrip-form">
          <button className="mytrips-close-button" onClick={closeForm}>
            X
          </button>
          <StyledWrapper>
            <form onSubmit={handleSubmit}>
              {submitTripErrorMessage && (
                <p className="error">{submitTripErrorMessage}</p>
              )}

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
              <label>
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label>
                End Date
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </label>

              <label>
                Upload Your Trip Photos:
                <input
                  type="file"
                  onChange={(e) => setPhotos(e.target.files)}
                  multiple
                />
              </label>
              <div className="stars-container">
                <label>Rate Your Trip: </label>
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
            {loading && <div className="pulsing-circle"></div>}
          </StyledWrapper>
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
    </div>
  );
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
  }

  .pulsing-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #00bfff;
    animation: pulse 1.5s infinite;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.4;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .message,
  .signin {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signin {
    text-align: center;
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .signin a {
    color: #00bfff;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 5px 5px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.5s;
  }

  .form label .input:focus + span {
    top: -8px;
    font-size: 0.7em;
  }

  .form label .input:focus {
    border-color: #00bfff;
    border-width: 2px;
    background-color: #111;
    outline: 0;
  }

  .form .btn {
    background-color: #00bfff;
    font-weight: 500;
    font-size: 18px;
    padding: 10px 10px;
    text-align: center;
    border-radius: 10px;
    border: none;
    color: white;
    margin-top: 20px;
  }

  .form .btn:disabled {
    opacity: 0.6;
  }
`;

export default MyTrips;
