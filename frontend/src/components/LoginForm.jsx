import React, { useState } from "react";
import axios from "axios";
import "../styles/components/Form.css"; // Ensure this path is correct

const LoginForm = ({ onLoginSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/usersRoutes/login`, // Correct API URL
        { email, password }
      );

      if (response.status === 200) {
        localStorage.setItem("user_id", response.data.user.user_id);
        onLoginSuccess(response.data); // Notify parent of success
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
          placeholder="Enter your email" // Optional placeholder
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
          placeholder="Enter your password" // Optional placeholder
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
