import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"; // Import LoginForm
import RegisterForm from "../components/RegisterForm"; // Import RegisterForm
import Modal from "../components/Modal"; // Import the new Modal component
import { useAuth } from "../context/AuthContext"; // Import Auth context
import HeaderButton from "./HeaderButton"; // Import HeaderButton component
import HelloMessage from "./HelloMessage"; // Ensure correct path
import WelcomeMessage from "./WelcomeMessage";
import styled from "styled-components";

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
    <HeaderContainer>
      <HeaderSpacer />
      <Navbar>
        <HeaderButton label="Home" onClick={() => navigate("/")} />
        <HeaderButton
          label="Plan your trip"
          onClick={() => navigate("/PlanTrip")}
        />
        <HeaderButton label="About us" onClick={() => navigate("/AboutUs")} />

        {user && (
          <>
            <HeaderButton
              label="My memories"
              onClick={() => navigate("/MyTrips")}
            />
            <HeaderButton
              label="Wishlist"
              onClick={() => navigate("/MyWishlist")}
            />
            <HeaderButton
              label="My Profile"
              onClick={() => navigate("/Profile")}
            />
          </>
        )}
      </Navbar>
      <ButtonsContainer>
        {user ? (
          <>
            <HelloMessage
              text={`Hello ${getFirstName(user.name)} 👋`}
              tooltipText={`Great to see u again !`}
            />
            <HeaderButton label="Logout" onClick={handleLogoutClick} />
          </>
        ) : (
          <>
            <HeaderButton label="Register" onClick={openRegisterModal} />
            <HeaderButton label="Login" onClick={openLoginModal} />
          </>
        )}
      </ButtonsContainer>

      {/* Modals remain the same */}
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="">
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onError={handleError}
          closeModal={closeLoginModal}
        />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} title="">
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onError={handleError}
          closeModal={closeRegisterModal}
        />
      </Modal>

      <WelcomeMessage
        userName={welcomeMessage.userName}
        isVisible={welcomeMessage.visible}
        onClose={closeWelcomeMessage}
      />
    </HeaderContainer>
  );
};

// styled components for Header
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1000;
`;

const HeaderSpacer = styled.div`
  width: 200px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

export default Header;
