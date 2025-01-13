import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

// Form Input Components
const FormInput = ({ label, id, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>
      <input className="input" id={id} {...props} />
      <span>{label}</span>
    </label>
  </div>
);

const TextInput = ({ id, label, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="text"
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const DateInput = ({ id, label, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="date"
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const FileInput = ({ onChange }) => (
  <FormInput
    label="Upload Photos"
    id="album"
    type="file"
    onChange={(e) => onChange("album", e.target.files)}
    multiple
    accept="image/*"
  />
);

const StarRating = ({ value, onChange }) => (
  <div className="form-group">
    <div className="stars-container">
      <span className="rating-label">Rate Your Trip</span>
      <div className="stars-wrapper">
        {Array(5).fill(0).map((_, index) => (
          <span
            key={index + 1}
            className={`star ${index + 1 <= value ? "selected" : ""}`}
            onClick={() => onChange("stars", index + 1)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ReviewTextarea = ({ value, onChange }) => (
  <div className="form-group">
    <label>
      <textarea
        className="input textarea-input"
        value={value}
        onChange={(e) => onChange("review", e.target.value)}
        placeholder="Share your experience..."
        rows="4"
        required
      />
      <span>Review</span>
    </label>
  </div>
);

const AddTripForm = ({ onClose, onTripAdded, userId }) => {
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    album: null,
    stars: 0,
    review: ""
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [submitTripErrorMessage, setSubmitTripErrorMessage] = useState("");

  const validateDates = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return end >= start;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDates()) {
      setSubmitTripErrorMessage("End date must be after start date");
      return;
    }

    setLoading(true);
    setSubmitTripErrorMessage("");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'album' && formData[key]) {
          Array.from(formData[key]).forEach(file => {
            formDataToSend.append('album', file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        `http://localhost:5001/api/tripsRoutes/addTrip/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        onTripAdded(response.data.trip);
        onClose();
      }
    } catch (err) {
      setSubmitTripErrorMessage("An error occurred while submitting the trip details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Add New Trip</p>
        <p className="message">Share your amazing journey with us!</p>
        
        <TextInput 
          id="tripName"
          label="Trip Name"
          value={formData.tripName}
          onChange={updateFormData}
        />
        
        <TextInput 
          id="destination"
          label="Destination"
          value={formData.destination}
          onChange={updateFormData}
        />
        
        <div className="flex">
          <DateInput 
            id="startDate"
            label="Start Date"
            value={formData.startDate}
            onChange={updateFormData}
          />
          
          <DateInput 
            id="endDate"
            label="End Date"
            value={formData.endDate}
            onChange={updateFormData}
          />
        </div>
        
        <FileInput onChange={updateFormData} />
        
        <StarRating 
          value={formData.stars}
          onChange={updateFormData}
        />
        
        <ReviewTextarea 
          value={formData.review}
          onChange={updateFormData}
        />

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
    resize: none;
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

  .form-group {
    position: relative;
    margin-bottom: 10px;
  }

  .form-group .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 5px 5px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form-group .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .textarea-input {
    resize: none;
    min-height: 120px;
    padding-top: 25px !important;
    line-height: 1.5;
    font-family: inherit;
  }

  .stars-wrapper {
    margin-top: 8px;
    display: flex;
    gap: 5px;
  }
`;

export default AddTripForm;
