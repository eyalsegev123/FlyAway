import React, { useState } from "react";
import axios from "axios";
import "../styles/components/Form.css";

const LoginForm = ({ onLoginSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login", // Replace with your actual API URL
        { email, password }
      );

      if (response.status === 200) {
        onLoginSuccess(); // Notify parent of success
      }
    } catch (err) {
      onError("Invalid credentials. Please try again."); // Notify parent of error
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
