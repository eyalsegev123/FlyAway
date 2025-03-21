import React from 'react';
import styled from 'styled-components';

const AboutUsCard = ({ title, description, buttonLabel, onButtonClick }) => {
  return (
    <StyledWrapper>
      <div className="notification">
        <div className="notiglow" />
        <div className="notiborderglow" />
        <div className="notititle">{title}</div>
        <div className="notibody">{description}</div>
        {buttonLabel && <button className="picture-button" onClick={onButtonClick}>{buttonLabel}</button>}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .notification {
    display: flex;
    flex-direction: column;
    isolation: isolate;
    position: relative;
    width: 36rem;
    height: 16rem;
    background: #29292c;
    border-radius: 1rem;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
    --gradient: linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff);
    --color: #32a6ff;
  }

  .picture-button {
    display: inline-block;  /* Ensures the button is treated as an inline-level block container */
    padding: 8px 16px;      /* Adds space inside the button */
    background-color: #3d83ff; /* Gives the button a primary color */
    color: white;           /* Text color for visibility */
    width: 200px;
    font-size: 18px;        /* Makes the text inside the button large enough to be readable */
    border: none;           /* Removes the default border */
    border-radius: 4px;     /* Rounds the corners of the button */
    z-index: 10;
    cursor: pointer;        /* Changes the mouse cursor to a pointer to indicate it's clickable */
    text-align: center;     /* Centers the text inside the button */
    text-decoration: none;  /* Removes underline from text if it's an <a> element */
    box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Optional: adds a subtle shadow to make the button pop out */
    transition: background-color 0.3s, transform 0.2s; /* Smooth transition for hover effects */
    margin-top: 6px; /* Add top margin to separate from the content above */
    align-self: center;
  }

  .picture-button:hover, .picture-button:focus {
    background-color: #0056b3; /* Darker shade when hovered or focused for better user interaction feedback */
    transform: scale(1.05);    /* Slightly enlarges the button when hovered or focused */
    outline: none;             /* Removes the outline to keep the design clean */
  }

  .notification:before {
    position: absolute;
    content: "";
    inset: 0.0625rem;
    border-radius: 0.9375rem;
    background: #18181b;
    z-index: 2;
  }

  .notification:after {
    position: absolute;
    content: "";
    width: 0.25rem;
    inset: 0.65rem auto 0.65rem 0.5rem;
    border-radius: 0.125rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }

  .notification:hover:after,
  .notification:hover .notititle,
  .notification:hover .notibody {
    transform: translateX(0.25rem);
  }

  .notititle, .notibody {
    padding: 0.65rem 0.25rem 0.4rem 1.25rem;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notititle {
    color: var(--color);
    font-weight: 500;
    font-size: 1.7rem;
    font-weight: bold;
  }

  .notibody {
    color: #99999d;
    font-size: 1em;
  }

  .notiglow,
  .notiborderglow {
    position: absolute;
    width: 20rem;
    height: 20rem;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side at center, white, transparent);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .notification:hover .notiglow,
  .notification:hover .notiborderglow {
    opacity: 0.1;
  }
`;

export default AboutUsCard;
