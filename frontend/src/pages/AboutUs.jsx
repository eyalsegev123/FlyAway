import React, { useState } from "react";
import "../styles/pages/AboutUs.css"; // Ensure you have the updated CSS
import RainbowButton from "../components/RainbowButton"; // Assuming RainbowButton is a separate component
import Header from "../components/Header"; // Import your Header component

const AboutUs = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const buttonData = [
    {
      label: "Who are we?",
      text: "We are three Computer Science students working on this project as part of our academic studies. FlyAway is a holiday planner powered by artificial intelligence, designed to make your trip planning effortless and personalized. Our goal is to help you discover the best vacation destinations tailored to your preferences, with intelligent recommendations and easy-to-use features."
    },
    {
      label: "Why FlyAway?",
      text: "FlyAway offers a smart and intuitive approach to planning your next holiday. With our AI-powered recommendations, you can save time and effort by having your travel plans curated for you. Whether you're seeking the perfect getaway or looking for unique vacation ideas, FlyAway ensures you get the most out of your time off, all within an easy and convenient platform. Let us handle the details, so you can focus on making memories."
    },
    {
      label: "Terms of usage",
      text: "By using this platform, you agree to provide accurate information and acknowledge that we may collect and store your data to improve your experience. We also reserve the right to use your information in accordance with OpenAI’s privacy policies to enhance the functionality of this service. You are solely responsible for maintaining the security and confidentiality of your account details."
    }
  ];

  return (
    <div className="about-us-container">
      {/* Include your Header component */}
      <Header />

      <div className="button-container">
        {buttonData.map((button, index) => (
          <RainbowButton
            key={index}
            label={button.label}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}
          />
        ))}
      </div>

      {hoveredButton !== null && (
        <div className="info-box">
          {buttonData[hoveredButton].text}
        </div>
      )}
    </div>
  );
};

export default AboutUs;
