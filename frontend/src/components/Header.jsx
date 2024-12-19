import React, { useState, useEffect } from "react";
import Button from "./Button"; // Import the Button component
import LoginForm from "../components/LoginForm"; // Import LoginForm
import RegisterForm from "../components/RegisterForm"; // Import RegisterForm
import Modal from "../components/Modal"; // Import the new Modal component
import "../styles/components/Header.css"; // Import CSS for styling

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [userName, setUserName] = useState(null);

  // Check if user is logged in (on component mount)
  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    if (storedUserName) {
      setUserName(JSON.parse(storedUserName)); // Set user name from localStorage
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleLoginSuccess = (data) => {
    alert(data.message); // Display user name
    localStorage.setItem("user_name", JSON.stringify(data.user.name));
    localStorage.setItem("user_id", JSON.stringify(data.user.id)); // Save user info to localStorage
    setUserName(data.user.name); // Update state to reflect logged-in user
    closeLoginModal();
  };

  const handleRegisterSuccess = (data) => {
    alert(data.message); // Display user name
    localStorage.setItem("user_name", JSON.stringify(data.user.name));
    localStorage.setItem("user_id", JSON.stringify(data.user.id)); // Save user info to localStorage
    setUserName(data.user.name); // Update state to reflect logged-in user
    closeRegisterModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    setUserName(null); // Reset state when logging out
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

      {/* Conditionally render buttons */}
      <div className="header-buttons-container">
        {userName ? (
          <div className="header-greeting-container">
            <div className="header-greeting-box">
              <span className="header-greeting">Hello, {userName}</span>
            </div>
            <Button
              className="header-buttons logout"
              label="Logout"
              onClick={handleLogout}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Render the Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Login">
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
