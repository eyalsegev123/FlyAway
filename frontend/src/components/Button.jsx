import React from "react";
import "../styles/components/Button.css"; // Import the CSS file

const Button = ({ label, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;

