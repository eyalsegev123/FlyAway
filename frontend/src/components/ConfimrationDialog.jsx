import React from "react";
import styled from "styled-components";

const DialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1a1a1a;
  border: 1px solid #ff6b6b; /* Red border for delete confirmation */
  border-radius: 10px;
  padding: 20px;
  z-index: 1010;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.2);
  max-width: 400px;
  text-align: center;
  color: white;
`;

const Title = styled.h2`
  color: #ff6b6b; /* Red for delete confirmation */
  margin-bottom: 10px;
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &.confirm {
    background-color: #ff6b6b;
    color: white;

    &:hover {
      background-color: #ff5252;
    }
  }

  &.cancel {
    background-color: #444;
    color: white;

    &:hover {
      background-color: #555;
    }
  }
`;

const ConfirmationDialog = ({
  isVisible,
  onConfirm,
  onCancel,
  tripName, // accepts tripName or wishName
  itemType = "trip", // default to "trip", but can be "wish"
}) => {
  if (!isVisible) return null;

  return (
    <DialogContainer>
      <Title>Delete {itemType === "wish" ? "Wish" : "Trip"}</Title>
      <Message>
        Are you sure you want to delete "{tripName}" from your{" "}
        {itemType === "wish" ? "wishlist" : "trips"}?
      </Message>
      <ButtonContainer>
        <Button className="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="confirm" onClick={onConfirm}>
          Delete
        </Button>
      </ButtonContainer>
    </DialogContainer>
  );
};

export default ConfirmationDialog;
