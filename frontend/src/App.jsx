// src/App.js
import React from "react";
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PlanTrip from "./pages/PlanTrip";
import LoginForm from "./components/LoginForm";  // Add LoginForm import
import Recommendation from "./pages/Recommendation";
import MyTrips from "./pages/MyTrips";
import Header from "./components/Header";
import MyWishlist from "./pages/MyWishlist";
import Profile from "./pages/Profile";


import './styles/App.css';  // Make sure this import is at the top
import backgroundVideo from './assets/background.mp4';  // Corrected import as per your code

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <video autoPlay loop muted preload="auto" id="background-video">
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/PlanTrip" element={<PlanTrip />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/Recommendation" element={<Recommendation />} />
              <Route path="/MyTrips" element={<MyTrips />} />
              <Route path="/MyWishlist" element={<MyWishlist />} />
              <Route path="/Profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
