import React from 'react';
import '../styles/components/RainbowButton.css';

const RainbowButton = ({ label, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      className="rainbow-button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </button>
  );
};

export default RainbowButton;
