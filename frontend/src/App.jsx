// src/App.js
import React, { useState } from "react";
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Sidebar component
import HomePage from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PlanTrip from "./pages/PlanTrip";
import LoginForm from "./components/LoginForm";  // Add LoginForm import
import Recommendation from "./pages/Recommendation";
import MyTrips from "./pages/MyTrips";
import Header from "./components/Header";
import MyWishlist from "./pages/MyWishlist";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header/>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
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
