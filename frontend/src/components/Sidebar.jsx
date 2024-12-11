// src/components/Sidebar.jsx
import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import HamburgerButton from "./HamburgerButton"; // Import the hamburger button
import "../styles/components/Sidebar.css"; // Ensure the CSS file is linked

const Sidebar = () => {
  // State to track whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the sidebar state when the button is clicked
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Hamburger menu button */}
      <HamburgerButton toggleSidebar={toggleSidebar} />

      <div className="sidebar-header">
        <h2>Menu</h2> {/* Branding or profile name */}
      </div>
      <ul className="nav-list">
        <SidebarItem to="/" text="Home" />
        <SidebarItem to="/PlanTrip" text="Plan a Trip" />
        <SidebarItem to="/AboutUs" text="About Us" />
      </ul>
    </div>
  );
};

export default Sidebar;
