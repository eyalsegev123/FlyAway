import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import styled from "styled-components";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Close, Check } from "@mui/icons-material";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import dayjs from 'dayjs';
import axios from "axios";

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

const PhotoModal = ({ isOpen, photos, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Trip Album</h2>
        <div className="photos-container">
          {photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Photo ${index + 1}`} />
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const TripCardButton = ({ trip, onDelete, onEdit }) => {
  const navigate = useNavigate(); // to add navigation to recommendation page
  const [isEditing, setIsEditing] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false); // state to control modal visibility
  const [albumPhotos, setAlbumPhotos] = useState([]); // state to hold photos from S3
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewModal , setReviewModal] = useState([]);
  
  const [editFormData , setEditFormData] = useState({
    trip_name: trip.trip_name,
    review: trip.review,
    start_date: formatDate(trip.start_date, true),
    end_date: formatDate(trip.end_date, true),
    stars: trip.stars
  });
  
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

  const fetchAlbumPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tripsRoutes/fetchAlbum/${trip.trip_id}`);
      setAlbumPhotos(response.data.photos); // assuming the response contains an array of photos
      setIsAlbumOpen(true); // open the modal
    } catch (error) {
      console.error('Error fetching album photos', error);
    }
  };

  const handleCloseAlbum = () => {
    setIsAlbumOpen(false); // close the modal
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

  const StarRating = ({ value, onChange }) => (
    <div className="form-group">
      <div className="stars-container">
        <span className="rating-label">Rate Your Trip</span>
        <div className="stars-wrapper">
          {Array(5).fill(0).map((_, index) => (
            <span
              key={index + 1}
              className={`star ${index + 1 <= value ? "selected" : ""}`}
              onClick={() => onChange(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const editForm = () => (
    <div className="edit-form">
      <label>
        <span>Trip Name</span>
        <input
          type="text"
          value={editFormData.trip_name}
          onChange={(e) =>
            setEditFormData({ ...editFormData, trip_name: e.target.value })
          }
        />
      </label>
      <label>
        <span>Start Date</span>
        <input
          type="date"
          value={editFormData.start_date}
          onChange={(e) =>
            setEditFormData({ ...editFormData, start_date: e.target.value })
          }
        />
      </label>
      <label>
        <span>End Date</span>
        <input
          type="date"
          value={editFormData.end_date}
          onChange={(e) =>
            setEditFormData({ ...editFormData, end_date: e.target.value })
          }
        />
      </label>
      {dateErrorMessage && <p className="error">{dateErrorMessage}</p>}
      <label>
        <StarRating
          value={editFormData.stars}
          onChange={(e) =>
            setEditFormData((prev) => ({ ...prev, stars: e }))}
        />
      </label>

      {/* text area needs to be unexpandable */}
      <label>
        <span>review</span>
        <textarea
          value={editFormData.review}
          onChange={(e) =>
            setEditFormData({ ...editFormData, review: e.target.value })
          }
        />
      </label>
      <div className="edit-buttons">
        <IconButton
          onClick={() => setIsEditing(false)}
          className="cancel-button"
        >
          <Close />
        </IconButton>
        <IconButton onClick={handleEditSubmit} className="save-button">
          <Check color="primary" />
        </IconButton>
      </div>
    </div>
  );

  const content = () => (
    <div className="book" onClick={handleEnterTripButton}>
      <div className="content">
        <div className="content-inner">
          <p className="destination">{trip.destination}</p>
          <p className="start_date">{formatDate(trip.start_date)}</p>
          <p className="end_date">{formatDate(trip.end_date)}</p>
          <p className="review">{trip.review || "No review added"}</p>
          
          <div className="action-buttons">
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                fetchAlbumPhotos();
              }}
              className="album-button"
              style={{ color: 'white' }}
            >
              <PhotoLibraryIcon />
            </IconButton>
            <PhotoModal
              isOpen={isAlbumOpen}
              photos={albumPhotos}
              onClose={() => setIsAlbumOpen(false)}
            />
          </>  
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
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

  return <StyledWrapper>{isEditing ? editForm() : content()}</StyledWrapper>;
};

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
    gap: 10px;
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
      color: rgba(255, 255, 255, 0.7); /* Lighter text for labels */
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
    color: rgba(255, 255, 255, 0.7); /* Example color adjustment for better visibility */
    margin-right: 10px; /* Maintain or adjust spacing as needed */
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
