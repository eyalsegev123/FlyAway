import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const AddTripForm = ({ onClose, onTripAdded, userId }) => {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [photos, setPhotos] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitTripErrorMessage, setSubmitTripErrorMessage] = useState("");

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

      const response = await axios.post(
        `http://localhost:5001/api/tripsRoutes/addTrip/${userId}`,
        newTrip
      );

      if (response.status === 201) {
        onTripAdded(response.data.trip);
        onClose();
      }
    } catch (err) {
      setSubmitTripErrorMessage(
        "An error occurred while submitting the trip details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value) => {
    setStars(value);
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Add New Trip</p>
        <p className="message">Share your amazing journey with us!</p>
        
        <label>
          <input
            className="input"
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder=""
            required
          />
          <span>Trip Name</span>
        </label>

        <label>
          <input
            className="input"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder=""
            required
          />
          <span>Destination</span>
        </label>

        <div className="flex">
          <label>
            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <span>Start Date</span>
          </label>

          <label>
            <input
              className="input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <span>End Date</span>
          </label>
        </div>

        <label>
          <input
            className="input"
            type="file"
            onChange={(e) => setPhotos(e.target.files)}
            multiple
          />
          <span>Upload Photos</span>
        </label>

        <div className="stars-container">
          <span className="rating-label">Rate Your Trip: </span>
          {Array(5).fill(0).map((_, index) => (
            <span
              key={index + 1}
              className={`star ${index + 1 <= stars ? "selected" : ""}`}
              onClick={() => handleStarClick(index + 1)}
            >
              ★
            </span>
          ))}
        </div>

        <label>
          <textarea
            className="input"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder=""
            rows="4"
            required
          ></textarea>
          <span>Review</span>
        </label>

        <button className="submit" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Trip"}
        </button>
        
        {submitTripErrorMessage && <p className="error">{submitTripErrorMessage}</p>}
      </form>
    </StyledWrapper>
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

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #00bfff;
  }

  .message,
  .signin {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .signin a {
    color: #00bfff;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
    width: 100%;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 05px 05px 10px;
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
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .stars-container {
    margin: 10px 0;
    padding: 10px;
    background-color: #333;
    border-radius: 10px;
    border: 1px solid rgba(105, 105, 105, 0.397);
  }

  .rating-label {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9em;
    margin-right: 10px;
  }

  .star {
    cursor: pointer;
    font-size: 20px;
    color: #666;
    transition: color 0.2s;
  }

  .star.selected {
    color: #00bfff;
  }

  textarea.input {
    resize: vertical;
    min-height: 100px;
  }

  .error {
    color: #ff4444;
    text-align: center;
    margin-top: 10px;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-color: #00bfff;
    cursor: pointer;

    &:hover {
      background-color: #00bfff96;
    }

    &:disabled {
      background-color: #666;
      cursor: not-allowed;
    }
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default AddTripForm;
