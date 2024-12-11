import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/pages/Home.css"; // Import the CSS file

const HomePage = () => {
  return (
    <div className="homepage-container">
        <Header />
        <Sidebar />
    </div>
  );
};

export default HomePage;
