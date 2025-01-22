import React, { useState } from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import { Delete, Edit, Close, Check , RateReview} from "@mui/icons-material";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import dayjs from 'dayjs';
import Modal from "./Modal";

const formatDate = (dateString, forInput = false) => {
  if (!dateString) return ''; // Handle empty dates
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Handle invalid dates
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return forInput ? 
    `${year}-${month}-${day}` : // Format for input type="date"
    `${day}-${month}-${year}`;  // Format for display
};



const TripCardButton = ({ trip, onDelete, onEdit , onAlbumPress, onReviewPress}) => {
  const [isEditing, setIsEditing] = useState(false);  
  const [editFormData , setEditFormData] = useState({
    trip_name: trip.trip_name,
    review: trip.review,
    start_date: formatDate(trip.start_date, true),
    end_date: formatDate(trip.end_date, true),
    stars: trip.stars
  });
  const [originalFormData, setOriginalFormData] = useState(editFormData);

  const handleOpenEdit = () => {
    setOriginalFormData({ ...editFormData }); // Save the current state as the original
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setEditFormData({ ...originalFormData }); // Reset to the original values
    setIsEditing(false);
  };
  
  const trip_id = trip.trip_id;
  
  const [dateErrorMessage, setdateErrorMessage] = useState("");

  const validateDates = () => {
    const today = dayjs().startOf('day');
    const start = dayjs(editFormData.start_date);
    const end = dayjs(editFormData.end_date);

    // Check if the date is valid and not before today
    if (!start.isValid() || !end.isValid()) {
      setdateErrorMessage('Please enter valid dates');
      return false;
    }

    if(start.isAfter(end)) {
      setdateErrorMessage('End date must be after start date');
      return false;
    }

    if (end.isAfter(today)) {
      setdateErrorMessage('End date cannot be in the future');
      return false;
    }

    setdateErrorMessage('');
    return true;
  };

  const handleEditSubmit = () => {
    if(!validateDates())
      return;

    // Create updatedData without modifying the dates first
    const updatedData = {
      ...editFormData
    };

    // If either date field is empty, use the original trip dates
    if (!editFormData.start_date) {
      updatedData.start_date = formatDate(trip.start_date, true);
    }
    if (!editFormData.end_date) {
      updatedData.end_date = formatDate(trip.end_date, true);
    }

    onEdit(trip_id, updatedData);
    setIsEditing(false); // Close the edit form
  };

  const handleEnterTripButton = () => {
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const editForm = () => (
    <EditFormContainer>
      <div className="edit-form">
        <label>
          <span>Trip Name</span>
          <input
            type="text"
            value={editFormData.trip_name}
            onChange={(e) =>
              handleInputChange('trip_name', e.target.value)}
          />
        </label>
        <label>
          <span>Start Date</span>
          <input
            type="date"
            value={editFormData.start_date}
            onChange={(e) =>
              handleInputChange('start_date', e.target.value)}
          />
        </label>
        <label>
          <span>End Date</span>
          <input
            type="date"
            value={editFormData.end_date}
            onChange={(e) =>
              handleInputChange('end_date', e.target.value)}
          />
        </label>
        {dateErrorMessage && <p className="error">{dateErrorMessage}</p>}
        <StarRating
          value={editFormData.stars}
          onChange={handleInputChange}
        />
      
        {/* text area needs to be unexpandable */}
        <label>
          <span>review</span>
          <textarea
            value={editFormData.review}
            onChange={(e) =>
              handleInputChange('review', e.target.value)}
          />
        </label>
        <div className="edit-buttons">
          <IconButton
            onClick={handleCloseEdit}
            className="cancel-button"
          >
            <Close />
          </IconButton>
          <IconButton onClick={handleEditSubmit} className="save-button">
            <Check color="primary" />
          </IconButton>
        </div>
      </div>
    </EditFormContainer>
  );



  const content = () => (
    <div className="book" onClick={handleEnterTripButton}>
      <div className="content">
        <div className="content-inner">
          <p className="destination">{trip.destination}</p>
          <p className="start_date">{formatDate(trip.start_date)}</p>
          <p className="end_date">{formatDate(trip.end_date)}</p>
          
          <div className="action-buttons">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onReviewPress(trip);
              }}
              className="review-button"
              style={{ color: 'white' }}
            >
              <RateReview />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAlbumPress(trip);
              }}
              className="album-button"
              style={{ color: 'white' }}
            >
              <PhotoLibraryIcon />
            </IconButton> 
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEdit();
              }}
              className="edit-button"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.trip_id);
              }}
              className="delete-button"
            >
              <Delete color="white" />
            </IconButton>
            
          </div>
        </div>
      </div>
      <div className="cover">
        <h2>{trip.trip_name}</h2>
    </div>
  </div>
  );

  return (
    <StyledWrapper>
      {content()}
      <Modal isOpen={isEditing} onClose={handleCloseEdit}>
        {editForm()}
      </Modal>
    </StyledWrapper>
  )
};


const EditFormContainer = styled.div`
padding: 20px;
width: 700px;

.edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  label {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
    resize: none;
    height: 250px;
    font-size: 16px;
  }

  .edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
`;


const StyledWrapper = styled.div`

.book {
  position: relative;
  border-radius: 20px; /* Matched corner rounding */
  width: 270px;
  height: 300px;
  background-color: #1a1a1a; /* Dark background for consistency */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Soft shadow for depth */
  transform: preserve-3d;
  perspective: 2000px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff; /* White text for readability */
  margin: 20px;
}

.content {
  padding: 20px;
  padding-left: 40px; /* Added extra padding on the left */
  text-align: left;
  width: 100%;
  height: 100%;
  transform: translateX(20px); /* Added to shift content right */

  .content-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .destination {
    color: #00bfff; /* Retain specific green for destination highlight */
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 25px;
    text-transform: capitalize;
  }

  .review {
    font-size: 16px;
    color: #666; /* Lighter text for contrast */
    overflow-y: visible;
    max-height: none;
  }

  .action-buttons {
    margin-top: auto;
    display: flex;
    justify-content: center;
    gap: 5px;
  }
}

.star {
  cursor: pointer;
  font-size: 20px;
  color: #666; /* Lighter for contrast but consistent with other elements */
  transition: color 0.2s;
}

.star.selected {
  color: #00bfff; /* Keep highlight color for selected stars */
}


  .error {
    color: #ff4444;
    text-align: center;
    margin-top: 10px;
  }

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #1a1a1a; /* Dark background */
  color: #fff; /* White text color */
  border: 1px solid #333; /* Subtle border */
  border-radius: 20px; /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Soft shadow for depth */
  width: 100%; /* Full width within its parent container */
  max-width: 600px; /* Maximum width to control layout on larger screens */
  margin: auto; /* Centering in the available space */

  label {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      color: #00bfff; /* Lighter text for labels */
      font-weight: bold;
    }

    input,
    textarea {
      background-color: #333; /* Dark background for inputs */
      color: #fff; /* White text for inputs */
      border: 1px solid rgba(105, 105, 105, 0.397); /* Matching border */
      border-radius: 10px;
      padding: 10px;
      font-size: 15px;
      resize:none;
    }

    input::placeholder,
    textarea::placeholder {
      color: rgba(255, 255, 255, 0.5); /* Placeholder color */
    }

    input:focus,
    textarea:focus {
      border-color: #00bfff; /* Highlight color on focus */
      outline: none; /* Removing default outline */
    }
  }

  .rating-label {
    font-size: 1.0em; /* Smaller font size */
    color: #00bfff; 
    margin-right: 10px; /* Maintain or adjust spacing as needed */
    font-weight: bold;

  }

  .edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

/* Additional styling for specific components like buttons */
button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background-color: #00bfff; /* Consistent button color */
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #00bfff96; /* Hover effect */
  }

  &:disabled {
    background-color: #666; /* Disabled state */
    cursor: not-allowed;
  }
}


  .cover {
    top: 0;
    position: absolute;
    background:rgb(29, 29, 29);
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.5s;
    transform-origin: 0;
    box-shadow: 1px 1px 12px #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #00bfff;

    h2 {
      text-align: center;
      padding: 0 15px;
      word-wrap: break-word;
      max-width: 90%;
    }
  }

  .book:hover .cover {
    transition: all 0.5s;
    transform: rotatey(-80deg);
  }


`;

export default TripCardButton;
