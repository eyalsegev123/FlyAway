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
        <span>Wish Name </span>
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
              <Edit color="white"/>
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(wish.wish_id);
              }}
              className="delete-button"
            >
              <Delete color="white" />
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
    border-radius: 20px;
    width: 270px;
    height: 300px;
    background-color: #1a1a1a;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transform: preserve-3d;
    perspective: 2000px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin: 20px;
  }

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

  .content {
    padding: 20px;
    text-align: left;
    width: 100%;
    height: 100%;

    .content-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .destination {
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 20px;
      color: #00bfff;
      margin-left: 25px;
    }

    .notes {
      margin-bottom: 15px;
      font-size: 16px;
      color: white;
      margin-left: 25px;
    }

    .action-buttons {
      margin-top: auto;
      display: flex;
      justify-content: center;
      gap: 5px;
    }
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    max-width: 600px;
    margin: auto;

    label {
      display: flex;
      flex-direction: column;
      gap: 5px;

      span {
        color: #00bfff;
        font-weight: bold;
      }

      input, textarea {
        background-color: #333;
        color: #fff;
        border: 1px solid rgba(105, 105, 105, 0.397);
        border-radius: 10px;
        padding: 10px;
        font-size: 15px;
        resize: none;
      }

      input:focus, textarea:focus {
        border-color: #00bfff;
        outline: none;
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

export default WishCardButton;


