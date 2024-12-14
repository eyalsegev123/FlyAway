// src/components/SidebarItem.jsx
import React from "react";
import { Link } from "react-router-dom"; // Use React Router Link for navigation
import { FaHome, FaPlane, FaInfoCircle, FaBookOpen, FaHeart } from "react-icons/fa"; // Importing more icons

const SidebarItem = ({ to, text }) => {
  // Render the appropriate icon based on the text prop
  const renderIcon = (text) => {
    switch (text) {
      case "Home":
        return <FaHome className="nav-icon" />;
      case "About Us":
        return <FaInfoCircle className="nav-icon" />;
      case "Plan a Trip":
        return <FaPlane className="nav-icon" />;
      case "My memories":
        return <FaBookOpen className="nav-icon" />;
      case "Wishlist":
        return <FaHeart className="nav-icon" />;
      default:
        return null; // Return nothing if no match is found
    }
  };

  return (
    <li className="nav-item">
      <Link to={to} className="nav-link">
        {renderIcon(text)}
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
