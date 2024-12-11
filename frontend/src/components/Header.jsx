import React, { useState } from "react";
import Button from "./Button"; // Import the Button component
import LoginForm from "../components/LoginForm"; // Import LoginForm
import RegisterForm from "../components/RegisterForm"; // Import RegisterForm
import Modal from "../components/Modal"; // Import the new Modal component
import "../styles/components/Header.css"; // Import CSS for styling

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLoginSuccess = () => {
    alert("Login successful!"); // Replace with your desired action
    closeLoginModal();
  };

  const handleRegisterSuccess = () => {
    alert("Registration successful!"); // Replace with your desired action
    closeRegisterModal();
  };

  const handleError = (message) => {
    alert(message); // Display error message
  };

  return (
    <div className="header">
      {/* Logo and title */}
      <div className="header-logo">
        <img src="/photos/logo.jpeg" alt="FlyAway Logo" className="header-logo-img" />
      </div>

      {/* Register and Login buttons */}
      <div className="header-buttons">
        <Button label="Register" onClick={openRegisterModal} />
        <Button label="Login" onClick={openLoginModal} />
      </div>

      {/* Render the Login Modal */}
      <Modal 
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title="Login">
        <LoginForm 
          onLoginSuccess={handleLoginSuccess} 
          onError={handleError} />
      </Modal>

      {/* Render the Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        title="Register"
      >
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onError={handleError}
        />
      </Modal>
    </div>
  );
};

export default Header;
