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


function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header/>
          <div className="main-content">
            <video id="background-video" autoPlay loop muted playsInline>
              <source src="/assets/video_background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/PlanTrip" element={<PlanTrip />} />
              <Route path="/login" element={<LoginForm />} /> {/* Add this route for login */}
              <Route path="/Recommendation" element={<Recommendation />} />
              <Route path ="/MyTrips" element = {<MyTrips />} />
              <Route path ="/MyWishlist" element = {<MyWishlist />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;




