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

  const handleLoginSuccess = (data) => {
    alert(data.message); // Display user name
    localStorage.setItem("user_name", JSON.stringify(data.user.name));
    localStorage.setItem("user_id", JSON.stringify(data.user.id));// Save user info to localStorage
    closeLoginModal();

    // Update UI to show "Hello, [name]" instead of login/register buttons
    // setIsLoggedIn(true); 
    // setUser(userData);
  };


  const handleRegisterSuccess = (data) => {
    alert(data.message); // Display user name
    localStorage.setItem("user_name", JSON.stringify(data.user.name));
    localStorage.setItem("user_id", JSON.stringify(data.user.id)); // Save user info to localStorage
    closeRegisterModal();
    // setIsLoggedIn(true);
    // setUser(userData);  
  };

  const handleError = (message) => {
    alert(message); // Display error message
  };

  return (
    <div className="header">
      {/* Logo and title */}
      <div className="header-logo">
        <img
          src="/photos/logo.jpeg"
          alt="FlyAway Logo"
          className="header-logo-img"
        />
      </div>

      {/* Register and Login buttons */}
      <div>
        <Button
          className="header-buttons"
          label="Register"
          onClick={openRegisterModal}
        />
        <Button
          className="header-buttons"
          label="Login"
          onClick={openLoginModal}
        />
      </div>

      {/* Render the Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Login">
        <LoginForm onLoginSuccess={handleLoginSuccess} onError={handleError} closeModal={closeLoginModal} />
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
          closeModal={closeRegisterModal}
        />
      </Modal>
    </div>
  );
};

export default Header;
