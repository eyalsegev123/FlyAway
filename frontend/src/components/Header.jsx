import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"; // Import LoginForm
import RegisterForm from "../components/RegisterForm"; // Import RegisterForm
import Modal from "../components/Modal"; // Import the new Modal component
import { useAuth } from "../context/AuthContext"; // Import Auth context
import "../styles/components/Header.css"; // Import CSS for styling
import HeaderButton from './HeaderButton'; // Import HeaderButton component
import HelloMessage from './HelloMessage'; // Ensure correct path
import WelcomeMessage from "./WelcomeMessage";


const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState({
    visible: false,
    userName: "",
  });
  const navigate = useNavigate(); // Define navigate function
  const { user, login, logout } = useAuth(); // Use context

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLoginSuccess = (data) => {
    closeLoginModal();
    login(data.user.name, data.user.id);
    // Show welcome message instead of alert
    setWelcomeMessage({
      visible: true,
      userName: data.user.name,
    });
  };

  const handleRegisterSuccess = (data) => {
    closeRegisterModal();
    login(data.user.name, data.user.id);
    // Show welcome message instead of alert
    setWelcomeMessage({
      visible: true,
      userName: data.user.name,
    });
  };

  const closeWelcomeMessage = () => {
    setWelcomeMessage({
      visible: false,
      userName: "",
    });
  };

  const handleLogoutClick = () => {
    logout(); // Use context to logout user
    navigate("/");

  };

  const handleError = (message) => {
    alert(message); // Display error message
  };

  const getFirstName = (fullName) => {
    return fullName.split(" ")[0]; // Split the full name and return the first element
  };

  return (
    <div className="header">
      <div className="header-spacer"></div> {/* Add this empty div */}
      <div className="header-navbar">
        <HeaderButton
          className="header-buttons"
          label="Home"
          onClick={() => navigate("/")}
        />
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

        {user && (
          <>
            <HeaderButton
              className="header-buttons"
              label="My memories"
              onClick={() => navigate("/MyTrips")}
            />
            <HeaderButton
              className="header-buttons"
              label="Wishlist"
              onClick={() => navigate("/MyWishlist")}
            />
          </>
        )}
      </div>
      <div className="header-buttons-container">
        {user ? (
          <>
            <HelloMessage
              text={`Hello ${getFirstName(user.name)} 👋`}
              tooltipText={`Great to see u again !`}
            />
            <HeaderButton
              className="header-buttons"
              label="Logout"
              onClick={handleLogoutClick}
            />
          </>
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
      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} title="">
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onError={handleError}
          closeModal={closeRegisterModal}
        />
      </Modal>

      {/* Add the welcome message component */}
      <WelcomeMessage
        userName={welcomeMessage.userName}
        isVisible={welcomeMessage.visible}
        onClose={closeWelcomeMessage}
      />
    </div>
  );
};

export default Header;
