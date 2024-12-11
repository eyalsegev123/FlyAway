// src/components/HamburgerButton.jsx
import React from "react";

const HamburgerButton = ({ toggleSidebar }) => {
  return (
    <button className="hamburger" onClick={toggleSidebar}>
      <div></div>
      <div></div>
      <div></div>
    </button>
  );
};

export default HamburgerButton;
