import React from 'react';
import styled from 'styled-components';

const CloseButton = ({ onClick, label }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <span className="X" />
        <span className="Y" />
        <div className="close">{label}</div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 2em;  // Reduced from 4em
    height: 2em;  // Reduced from 4em
    border: none;
    background: rgba(0, 191, 255, 0.11);
    border-radius: 5px;
    transition: background 0.5s;
  }

  .X, .Y {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1em;  // Reduced from 2em
    height: 0.75px;  // Reduced thickness for smaller design
    background-color: #fff;
    transform-origin: 50%;
  }

  .X {
    transform: translateX(-50%) rotate(45deg);
  }

  .Y {
    transform: translateX(-50%) rotate(-45deg);
  }

  .close {
    position: absolute;
    display: flex;
    padding: 0.4rem 0.75rem;  // Adjusted padding for smaller size
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    top: -70%;
    left: 50%;
    width: 1.5em;  // Adjusted width
    height: 0.85em;  // Adjusted height
    font-size: 10px;  // Smaller font size
    background-color: #131618;
    color: #bbe5ec;
    border: none;
    border-radius: 3px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s;
  }

  .button:hover {
    background-color: #00bfff;
  }

  .button:active {
    background-color: #007acc;
  }
`;

export default CloseButton;
