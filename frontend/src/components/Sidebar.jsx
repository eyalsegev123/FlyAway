import React, { useState } from "react";
import SidebarItem from "./SidebarItem.jsx";
import HamburgerButton from "./HamburgerButton.jsx";
import { useAuth } from '../context/AuthContext'; // Import the Auth context
import "../styles/components/Sidebar.css"; // Ensure the CSS file is linked

const Sidebar = () => {
  // State to track whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Use the AuthContext to check user login status

  // Toggle the sidebar state when the button is clicked
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div>
        <HamburgerButton toggleSidebar={toggleSidebar} />
      </div>

      {isOpen && (
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
      )}
      
      {isOpen && (
        <ul className="nav-list">
          <SidebarItem to="/" text="Home" />
          <SidebarItem to="/PlanTrip" text="Plan a Trip" />
          <SidebarItem to="/AboutUs" text="About Us" />

          {/* Show these links only if the user is logged in */}
          {user && ( // Checking for user instead of userName from localStorage
            <>
              <SidebarItem to="/MyTrips" text="My Memories" />
              <SidebarItem to="/MyWishlist" text="Wishlist" />
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
