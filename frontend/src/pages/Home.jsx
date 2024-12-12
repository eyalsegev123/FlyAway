import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import HomeMain from "../components/HomeMain.jsx";
import "../styles/pages/Home.css"; // Import the CSS file

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <Sidebar />
      <HomeMain />
    </div>
  );
};

export default HomePage;
