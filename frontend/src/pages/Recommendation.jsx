import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";
import CategoryCard from "../components/CategoryCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  MobileStepper,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { parseOpenAIResponse } from "../utils/responseParser";

const Recommendation = () => {
  const theme = useTheme();
  const location = useLocation();
  const {
    tripRecommendation,
    destination,
    startDate,
    endDate,
    tripGenres,
    tripLength,
    budget,
  } = location.state || {};
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [wishName, setWishName] = useState('');
  const [notes, setNotes] = useState('');

  

  useEffect(() => {
    if (tripRecommendation?.answer) {
      const parsed = parseOpenAIResponse(tripRecommendation.answer);
      setParsedResponse(parsed);
    }
  }, [tripRecommendation]);

  const categories = useMemo(() => ({
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
    attractions: {
      title: "Attractions",
      content: parsedResponse?.attractions || {},
      type: "attractions",
    },
    restaurants: {
      title: "Restaurants & Dining",
      content: parsedResponse?.restaurants || {},
      type: "restaurants",
    },
    costs: {
      title: "Trip Costs Evaluation",
      content: parsedResponse?.costs || "No costs evaluation available",
      type: "costs",
    },
    dates: {
      title: "Best Dates",
      content: parsedResponse?.dates || "No dates recommendations available",
      type: "dates",
    },
  }), [parsedResponse]);
  
  
  const handleWishlistSubmit = async () => {
    const userId = user?.id;
    console.log(user.id);
    try {
      const response = await axios.post(`http://localhost:5001/api/wishesRoutes/addToWishList`, {
        user_id: parseInt(userId, 10),
        destination,
        start_date: startDate,
        end_date: endDate,
        trip_genres: tripGenres,
        trip_length: tripLength,
        budget,
        wish_name: wishName,
        notes,
        recommendation: tripRecommendation
      });
      if (response.status === 201) { //is it only 201????
        alert('Added to your wish list!');
        navigate("/MyWishlist");
      } else {
        throw new Error('Failed to add to wish list');
      }
    } catch (error) {
      console.error('An error occurred while adding to your wish list:', error);
      alert('An error occurred while adding to your wish list.');
    }
  };

  // Get the steps from the categories object
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
    <div className="recommendation-container" style={{
      padding: '20px',
      marginLeft: '140px', // account for sidebar width
      marginTop: '160px',   // account for header height
      boxSizing: 'border-box',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Paper 
        elevation={3} 
        className="recommendation-paper"
        sx={{ 
          width: '100%',
          maxWidth: '1200px', // limit maximum width
          boxSizing: 'border-box',
          padding: '24px',
          margin: '0 auto'
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

        {/* Additional Details Section */}
        {user && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <TextField
              label="Name Your Wish"
              variant="outlined"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              sx={{ mb: 1, width: '90%' }}
            />
            <TextField
              label="Notes"
              variant="outlined"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2, width: '90%' }}
            />
            <WishlistButton onAddToWishlist={handleWishlistSubmit}>Add to Wishlist</WishlistButton>
          </Box>
        )}
      </Paper>
    </div>
  );
};
export default Recommendation;
