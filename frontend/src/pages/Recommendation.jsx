import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";
import WishlistSecForm from "../components/WishlistSecForm";
import CategoryCard from "../components/CategoryCard";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Box,
  MobileStepper,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { parseOpenAIResponse } from "../utils/responseParser";

const Recommendation = () => {
  const theme = useTheme();
  const location = useLocation();
  const { tripRecommendation } = location.state || {};
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [showWishlistForm, setShowWishlistForm] = useState(false);


  useEffect(() => {
    if (tripRecommendation?.answer) {
      const parsed = parseOpenAIResponse(tripRecommendation.answer);
      setParsedResponse(parsed);
    }
  }, [tripRecommendation]);

  const categories = {
    summary: {
      title: "Trip Summary",
      content: parsedResponse?.summary || "No summary available",
      type: "summary",
    },
    hotels: {
      title: "Recommended Hotels",
      content: parsedResponse?.hotels || [],
      type: "hotels",
    },
    restaurants: {
      title: "Restaurants & Dining",
      content: parsedResponse?.restaurants || [],
      type: "restaurants",
    },
    attractions: {
      title: "Attractions & Sights",
      content: parsedResponse?.attractions || [],
      type: "attractions",
    },
    activities: {
      title: "Activities",
      content:
        parsedResponse?.activities || "No activities recommendations available",
    },
  };

  const handleWishlistSubmit = async (wishName, notes) => {
    const userId = localStorage.getItem("user_id");
    try {
      const response = await axios.post(`http://localhost:5001/api/wishesRoutes/user/${userId}`, {
        destination: tripRecommendation.destination,
        start_range: tripRecommendation.startDate,
        end_range: tripRecommendation.endDate,
        trip_genre: tripRecommendation.tripGenres.join(', '),
        trip_length: tripRecommendation.tripLength,
        budget: tripRecommendation.budget,
        content: "Here goes content if needed", // OpenAi answer
        notes: notes,
        wish_name: wishName
      });
  
      if (response.status === 201) {
        alert('Added to your wish list!');
        setShowWishlistForm(false); // Close the form on success
      } else {
        throw new Error('Failed to add to wish list');
      }
    } catch ( error ) {
      console.error('An error occurred while adding to your wish list:', error);
      alert('An error occurred while adding to your wish list.');
      setShowWishlistForm(false); // Optionally close the form on error
    }
  };
  
  

  const steps = Object.values(categories);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (!tripRecommendation) {
    return (
      <div className="recommendation-container">
        <p>No recommendations found.</p>
      </div>
    );
  }

  return (
    <div className="recommendation-container">
      <Paper 
        elevation={3} 
        className="recommendation-paper"
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          className="recommendation-title"
        >
          Your Trip Recommendations
        </Typography>
  
        {/* Desktop Stepper */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
  
        {/* Content Card */}
        <CategoryCard
          title={steps[activeStep].title}
          content={steps[activeStep].content}
          type={steps[activeStep].type}
        />
  
        {/* Mobile Stepper */}
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
  
        {user && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <WishlistButton onClick={() => setShowWishlistForm(true)}>Add to Wishlist</WishlistButton>
            {showWishlistForm && (
              <WishlistSecForm onSubmit={handleWishlistSubmit} onCancel={() => setShowWishlistForm(false)} />
            )}
          </Box>
        )}
      </Paper>
    </div>
  );
  
};

export default Recommendation;
