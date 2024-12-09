// Homepage.jsx
import React from 'react';
import '../styles/HomePage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to the Holiday Planner</h1>
        <p>Your ultimate tool for planning the perfect holiday.</p>
      </header>
      
      <section className="homepage-content">
        <h2>Features</h2>
        <ul>
          <li>Plan your trips</li>
          <li>Track your budget</li>
          <li>Get travel recommendations</li>
        </ul>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2024 Holiday Planner. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;