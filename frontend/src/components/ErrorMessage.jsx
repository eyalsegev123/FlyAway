// src/components/ErrorMessage.js
import React from "react";

const ErrorMessage = ({ message }) => {
  return message ? <div className="error">{message}</div> : null;
};

export default ErrorMessage;
