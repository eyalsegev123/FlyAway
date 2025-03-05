import React from 'react';
import styled from 'styled-components';
import TeamPhoto from '../assets/about_us_picture.jpg'; // Path to the photo file

const PhotoAboutUsModal = ({ onClose }) => {
  return (
    <StyledModal>
      <div className="modal-content">
        <img src={TeamPhoto} alt="" />
        <button onClick={onClose}>Close</button>
      </div>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(2.5); // Center and scale the modal
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  
  .modal-content {
    background: white;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto; // Handle larger content overflow
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

    img {
      width: 100%; // Responsive width
      height: auto; // Maintain aspect ratio
    }

    button {
      margin-top: 5px;
      padding: 4px 6px;
      background-color: #32a6ff;
      border: none;
      border-radius: px;
      color: white;
      cursor: pointer;
      font-size: 0.7rem; // Adjust font size if necessary
    }
    
    button:hover {
      background-color: #2596be;
    }
  }
`;




export default PhotoAboutUsModal;
