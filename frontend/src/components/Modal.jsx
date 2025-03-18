import React from "react";
import "../styles/components/Modal.css";
import CloseButton from "./CloseButton";
import styled from "styled-components";

const ModalTitle = styled.h2`
  color: #00bfff;
`;

const ModalOverlay = styled.div`
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalContent = styled.div`
  z-index: 1002;
  position: relative;
  max-width: 900px;  // Prevent overflow on small screens
  width: 100%;
  min-width: fit-content;  // Adjust to content
`;

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay className="modal-overlay" onClick={onClose}>
      <ModalContent 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton
          className="close-button-modal"
          label="&times;"
          onClick={onClose}
        />
        <ModalTitle>{title}</ModalTitle>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
