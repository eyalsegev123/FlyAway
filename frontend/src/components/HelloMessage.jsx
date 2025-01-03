import React from 'react';
import styled from 'styled-components';

const HelloMessage = ({ text, tooltipText }) => {
  return (
    <StyledHelloMessage>
      <div className="hello-container">
        <span className="hello">{text}</span>
        <span className="tooltip-text">{tooltipText}</span>
      </div>
    </StyledHelloMessage>
  );
}

const StyledHelloMessage = styled.div`
  .hello-container {
    --background: #494646;  /* Dark grey background */
    --color: #FFFFFF;  /* White text */
    position: relative;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    font-size: 12px; /* Smaller font size */
    font-weight: 600;
    color: var(--color);
    padding: 0.4em 1.2em; /* Smaller padding */
    border-radius: 8px;
    text-transform: uppercase; /* This makes all text uppercase in the container */
    height: 40px; /* Smaller height */
    width: 140px; /* Smaller width */
    display: grid;
    place-items: center;
    border: 2px solid transparent;
    background-color: var(--background);
    margin: 0 10px 0 0; /* Added right margin */
    box-shadow: none;  /* No box shadow */
  }

  .tooltip-text {
    position: absolute;
    top: 100%; /* Adjusted from bottom to top */
    left: 50%;
    transform: translateX(-50%) translateY(10px); /* Adjust to move tooltip below the box */
    padding: 0.2em 0.4em;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    background: #000000; /* Black tooltip background */
    color: var(--color); /* White tooltip text */
    z-index: 1000; /* Ensure it's above all other content */
    border-radius: 8px;
    font-weight: 400;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    visibility: hidden;
    text-transform: none; /* Override to keep the original text case */
  }

  .tooltip-text::before {
    content: "";
    position: absolute;
    height: 0.6em;
    width: 0.6em;
    top: -0.3em; /* Adjust to correctly position the arrow pointing upwards */
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    background: #000000; /* Arrow matches tooltip background */
  }

  .hello-container:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
`;

export default HelloMessage;
