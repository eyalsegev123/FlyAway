import React from "react";
import CloseButton from "./CloseButton";
import styled from "styled-components";

const ModalTitle = styled.h2`
  color: #00bfff;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 10px;
  width: 400px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1002;
  max-width: 900px;
  width: 100%;
  min-width: fit-content;
`;

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton label="&times;" onClick={onClose} />{" "}
        <ModalTitle>{title}</ModalTitle>
        {children}פ
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
