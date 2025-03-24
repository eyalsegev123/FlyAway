import React, { useState } from "react";
import styled from "styled-components";
import apiService from '../utils/api';

const RegisterForm = ({ onRegisterSuccess, onError, closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message on new submission

    // Check if the name contains only alphabetic characters (A-Z, a-z)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      setErrorMessage("Name must contain only alphabetic characters and spaces.");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      setLoading(false);
      return;
    }

    // Validate birthday format (YYYY-MM-DD)
    const birthdayRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!birthdayRegex.test(birthday)) {
      setErrorMessage("Invalid birthday format. Please use YYYY-MM-DD.");
      setLoading(false);
      return;
    }

    console.log("Attempting to register user...");
    try {

      const response = await apiService.register({
        name,
        email,
        password,
        birthday
      });

      if (response.status === 201) {
        console.log(response);
        onRegisterSuccess(response.data);
        closeModal(); // Close the modal after successful registration
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An error occurred. Please try again.";
      setErrorMessage(errorMessage); // Display backend error message
      onError(errorMessage); // Optional: Pass the error to parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access our features! </p>
        <div className="flex">
          <label>
            <input
              className="input"
              type="text"
              placeholder
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span>Name</span>
          </label>
          <label>
            <input
              className="input"
              type="date"
              placeholder
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
            <span>Birthday</span>
          </label>
        </div>
        <label>
          <input
            className="input"
            type="email"
            placeholder
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>Email</span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            placeholder
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>Password</span>
        </label>
        <label>
          <input
            className="input"
            type="password"
            placeholder
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span>Confirm password</span>
        </label>
        <button className="submit" type="submit" disabled={loading}>
          Submit
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 500px;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #00bfff;
  }

  .message, 
  .signin {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .signin a:hover {
    text-decoration: underline royalblue;
  }

  .signin a {
    color: #00bfff;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 05px 05px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .input {
    font-size: medium;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-color: #00bfff;
  }

  .submit:hover {
    background-color: #00bfff96;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default RegisterForm;
