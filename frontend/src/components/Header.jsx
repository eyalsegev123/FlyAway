import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"; // Import LoginForm
import RegisterForm from "../components/RegisterForm"; // Import RegisterForm
import Modal from "../components/Modal"; // Import the new Modal component
import { useAuth } from "../context/AuthContext"; // Import Auth context
import "../styles/components/Header.css"; // Import CSS for styling
import HeaderButton from './HeaderButton'; // Import HeaderButton component
import HelloMessage from './HelloMessage'; // Ensure correct path


const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate(); // Define navigate function
  const { user, login, logout } = useAuth(); // Use context

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLoginSuccess = (data) => {
    alert(data.message); // Display message
    login(data.user.name, data.user.id); // Use context to login user
    closeLoginModal();
  };

  const handleRegisterSuccess = (data) => {
    alert(data.message); // Display message
    login(data.user.name, data.user.id); // Use context to login user
    closeRegisterModal();
  };

  const handleLogoutClick = () => {
    logout(); // Use context to logout user
  };

  const handleError = (message) => {
    alert(message); // Display error message
  };

  const getFirstName = (fullName) => {
    return fullName.split(" ")[0]; // Split the full name and return the first element
  };

  return (
    <div className="header">
      {/* Logo and title */}
      <div className="header-logo">
        <img
          src="/photos/logo.png"
          alt="FlyAway Logo"
          className="header-logo-img"
        />
      </div>
    
      <div className="header-navbar">
        <HeaderButton
          className="header-buttons"
          label="Plan your trip"
          onClick={() => navigate("/PlanTrip")}
        />
        <HeaderButton
          className="header-buttons"
          label="About us"
          onClick={() => navigate("/AboutUs")}
        />
        <HeaderButton
          className="header-buttons"
          label="Home"
          onClick={() => navigate("/")}
        />
      </div>
    {user &&
      <div className="logged-in-navbar">
        <HeaderButton
          className="header-buttons"
          label= "My memories"
          onClick={() => navigate("/MyTrips")}
        />
        <HeaderButton 
          className="header-buttons"
          label="Wishlist"
          onClick={() => navigate("/MyWishlist")}
        />
      </div>
    }
  
      {/* Conditionally render buttons */}
      <div className="header-buttons-container">
        {user ? (
          <div className="header-greeting-container">
            <div className="header-greeting-box">
              <HelloMessage
                text = {`Hello ${getFirstName(user.name)} 👋`}
                tooltipText={`Great to see u again !`}
              />
            </div>
            <HeaderButton
              className="header-buttons"
              label="Logout"
              onClick={handleLogoutClick}
            />
          </div>
        ) : (
          <>
            <HeaderButton
              className="header-buttons"
              label="Register"
              onClick={openRegisterModal}
            />
            <HeaderButton
              className="header-buttons"
              label="Login"
              onClick={openLoginModal}
            />
          </>
        )}
      </div>

      {/* Render the Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="">
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onError={handleError}
          closeModal={closeLoginModal}
        />
      </Modal>

      {/* Render the Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        title=""
      >
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onError={handleError}
          closeModal={closeRegisterModal}
        />
      </Modal>
    </div>
  );
};

export default Header;
