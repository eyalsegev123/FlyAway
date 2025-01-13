import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Close, Check } from "@mui/icons-material";

const WishCardButton = ({ wish, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWishName, setEditedWishName] = useState(wish.wish_name || ""); ;
  const [editedWishNotes, setEditedWishNotes] = useState(wish.notes || "");


  const handleEnterWishButton = () => {
    navigate("/Recommendation", {
      state: {
        tripRecommendation: wish.recommendation,
        fromPlanTrip: false,
      }
    });
  };

  const handleEditSubmit = () => {
    onEdit(wish.wish_id, editedWishName, editedWishNotes); // Call the onEdit function with the updated details
    setIsEditing(false); // Close the edit form
  };

  const editForm = () => (
    <div className="edit-form">
      <label>
        <span>Wish Name</span>
        <input
          type="text"
          value={editedWishName}
          onChange={(e) => setEditedWishName(e.target.value)}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          value={editedWishNotes}
          onChange={(e) => setEditedWishNotes(e.target.value)}
        />
      </label>
      <div className="edit-buttons">
        <IconButton onClick={() => setIsEditing(false)} className="cancel-button">
          <Close />
        </IconButton>
        <IconButton onClick={handleEditSubmit} className="save-button">
          <Check color="primary" />
        </IconButton>
      </div>
    </div>
  );

  const content = () => (
    <div className="book" onClick={handleEnterWishButton}>
      <div className="content">
        <div className="content-inner">
          <p className="destination">{wish.destination}</p>
          <p className="notes">{wish.notes || 'No notes added'}</p>
          <div className="action-buttons">
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
                onDelete(wish.wish_id);
              }}
              className="delete-button"
            >
              <Delete color="error" />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="cover">
        <h2>{wish.wish_name}</h2>
      </div>
    </div>
  );

  return (
    <StyledWrapper>
      {isEditing ? editForm() : content()}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .book {
    position: relative;
    border-radius: 10px;
    width: 270px;
    height: 300px;
    background-color: whitesmoke;
    -webkit-box-shadow: 1px 1px 12px #000;
    box-shadow: 1px 1px 12px #000;
    transform: preserve-3d;
    perspective: 2000px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    margin: 20px;
  }

  .content {
    padding: 20px;
    padding-left: 40px; // Added extra padding on the left
    text-align: left;
    width: 100%;
    height: 100%;
    transform: translateX(20px); // Added to shift content right
    
    .content-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .destination {
      color: #21dc62;
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 25px;
      text-transform: capitalize;
    }

    .notes {
      font-size: 14px;
      color: #666;
      overflow-y: auto;
      max-height: 150px;
    }

    .action-buttons {
      margin-top: auto;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    width: 90%;
    background-color: #f0f0f0;
    border-radius: 10px;

    label {
      display: flex;
      flex-direction: column;
      gap: 5px;

      span {
        font-size: 14px;
        color: #666;
      }

      input, textarea {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 5px;
        font-size: 14px;
      }

      textarea {
        resize: none;
        height: 80px;
      }
    }

    .edit-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }

  .cover {
    top: 0;
    position: absolute;
    background: whitesmoke;
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
    color: darkblue;

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

export default WishCardButton;


