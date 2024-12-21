// src/components/HamburgerButton.jsx
import React from "react";
import "../styles/components/HamburgerButton.css";

const HamburgerButton = ({ toggleSidebar }) => {
  return (
    <button className="hamburger-button no-general-styles" onClick={toggleSidebar}>
      <div></div>
      <div></div>
      <div></div>
    </button>
  );
};

export default HamburgerButton;
