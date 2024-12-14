import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests
import "../styles/components/Form.css"; // Ensure this path is correct

const RegisterForm = ({ onRegisterSuccess, onError, closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the name contains only alphabetic characters (A-Z, a-z)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      onError("Name must contain only alphabetic characters and spaces.");
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      onError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    // Validate birthday format
    const birthdayRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Format: DD/MM/YYYY
    if (!birthdayRegex.test(birthday)) {
      onError("Invalid birthday format. Please use DD/MM/YYYY.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register", // Replace with your actual API endpoint
        {
          name,
          email,
          password,
          birthday
        }
      );

      if (response.status === 201) {
        onRegisterSuccess();
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="birthday">Birthday (DD/MM/YYYY)</label>
        <input
          type="text"
          id="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
          placeholder="e.g., 25/12/2000"
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
