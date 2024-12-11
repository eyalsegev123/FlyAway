// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Sidebar component
import HomePage from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PlanTrip from "./pages/PlanTrip";

function App() {
  return (
    <Router>
      {/* Main content area */}
      <div style={{ marginLeft: "250px", padding: "20px", flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/PlanTrip" element={<PlanTrip />} />
        </Routes>
      </div>
      
      <div style={{ display: "flex" }}>
        {/* Sidebar is now included */}
        <Sidebar />
      </div>
    </Router>
  );
}

export default App;
