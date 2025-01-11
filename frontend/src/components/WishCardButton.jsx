  import React from 'react';
  import styled from 'styled-components';
  import { IconButton } from "@mui/material";
  import { useNavigate } from "react-router-dom";
  import { Delete } from "@mui/icons-material";

  
  

  const WishCardButton = ({ trip, onDelete }) => {
    
    const navigate = useNavigate();

    const handleEnterWishButton = () => {
      navigate("/Wish", {
        state: {
          summary: trip.summary,
          hotels: trip.hotels,
          attractions: trip.attractions,
          restaurants: trip.restaurants,
          costs: trip.costs,
          dates: trip.dates,
        }
      });
    };


    return (
      <StyledWrapper>
        <div className="button-wrapper">
          <button onClick ={()=> handleEnterWishButton()}>
            <div>
              <span>
                <p>{trip.wish_name}</p>  {/* Display trip Name initially */}
              </span>
            </div>
            <div>
              <span>
                <p>{trip.destination}</p>  {/* Display trip Destination on hover */}
              </span>
            </div>
          </button>
          <IconButton
            onClick={() => onDelete(trip.wish_id)}
            aria-label="Delete"
            className="delete-button"
          >
            <Delete color="error" />
          </IconButton>
        </div>
      </StyledWrapper>
    );
  }
  
  const StyledWrapper = styled.div`
    .button-wrapper {
      display: flex;
      align-items: center;
    }
  
    button {
      outline: 0;
      border: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 140px;
      height: 50px;
      border-radius: 0.5em;
      box-shadow: 0 0.625em 1em 0 rgba(30, 143, 255, 0.35);
      overflow: hidden;
      transition: 0.6s cubic-bezier(.16,1,.3,1);
    }
  
    button div {
      width: 100%;
      transition: transform 0.6s cubic-bezier(.16,1,.3,1);
    }
  
    button:hover div {
      transform: translateY(-50px);
    }
  
    button div span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0.75em 1.125em;
    }
  
    button div:nth-child(1) {
      background-color: #1e90ff;
    }
  
    button div:nth-child(2) {
      background-color: #21dc62;
    }
  
    .delete-button {
      margin-left: 10px;  // Adjust spacing as needed
    }
  
    button p, .delete-button {
      font-size: 17px;
      font-weight: bold;
      color: #ffffff;
    }
  
    button:active {
      transform: scale(0.95);
    }
  `;
  
  export default WishCardButton;
