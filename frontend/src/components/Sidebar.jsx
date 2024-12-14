import React, { useState } from "react";
import SidebarItem from "./SidebarItem.jsx";
import HamburgerButton from "./HamburgerButton.jsx";
import "../styles/components/Sidebar.css"; // Ensure the CSS file is linked
import "../styles/components/Buttons.css";

const Sidebar = () => {
  // State to track whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);
  const userName = localStorage.getItem("user_name");
  

  // Toggle the sidebar state when the button is clicked
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <HamburgerButton toggleSidebar={toggleSidebar} />
        {isOpen && <h2>Menu</h2>}
      </div>
      {isOpen && (
        <ul className="nav-list">
          <SidebarItem to="/" text="Home" />
          <SidebarItem to="/PlanTrip" text="Plan a Trip" />
          <SidebarItem to="/AboutUs" text="About Us" />
          
          {/* Show these links only if the user is logged in */}
          {userName && (
            <>
              <SidebarItem to="/MyTrips" text="My memories" />
              <SidebarItem to="/MyWishlist" text="Wishlist" />
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
