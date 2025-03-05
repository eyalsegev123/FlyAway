import React, { useEffect } from "react";
import styled from "styled-components";

const MessageContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  border: 1px solid ${props => props.type === "success" ? "#4CAF50" : "#ff6b6b"};
  border-radius: 10px;
  padding: 20px;
  z-index: 1010;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in, fadeOut 0.3s ease-out 2.7s forwards;
  max-width: 400px;
  text-align: center;
  color: white;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const Title = styled.h2`
  color: ${props => props.type === "success" ? "#4CAF50" : "#ff6b6b"};
  margin-bottom: 10px;
`;

const Message = styled.p`
  margin-bottom: 0;
`;

const MessageBox = ({ isVisible, message, type = "success", onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <MessageContainer type={type}>
      <Title type={type}>
        {type === "success" ? "Success" : "Error"}
      </Title>
      <Message>{message}</Message>
    </MessageContainer>
  );
};

export default MessageBox;