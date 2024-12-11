import React from "react";
import "../styles/components/Modal.css"; // Add your own styles for the modal
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <Button
          className="close-button"
          label="&times;"
          onClick={onClose}
        ></Button>
        <h2>{title}</h2>
        {children} {/* Render the form passed as a child */}
      </div>
    </div>
  );
};

export default Modal;
