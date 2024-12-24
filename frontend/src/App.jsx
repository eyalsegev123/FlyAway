// src/App.js
import React from "react";
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Sidebar component
import HomePage from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PlanTrip from "./pages/PlanTrip";
import LoginForm from "./components/LoginForm";  // Add LoginForm import
import Recommendation from "./pages/Recommendation";
import MyTrips from "./pages/MyTrips";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/AboutUs" element={<AboutUs />} />
              <Route path="/PlanTrip" element={<PlanTrip />} />
              <Route path="/login" element={<LoginForm />} /> {/* Add this route for login */}
              <Route path="/Recommendation" element={<Recommendation />} />
              <Route path ="/MyTrips" element = {<MyTrips />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
