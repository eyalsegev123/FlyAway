import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CategoryCard from "../components/CategoryCard";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Button, Paper, Typography, Box, TextField, MobileStepper } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const Wish = () => {
  const theme = useTheme();
  const location = useLocation();
  const { summary, hotels, attractions, restaurants, costs, dates } = location.state || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0); 

  const categories = useMemo(() => ({
    summary: {
      title: "Trip Summary",
      content: summary || "No summary available",
      type: "summary",
    },
    hotels: {
      title: "Recommended Hotels",
      content: hotels || [] ,
      type: "hotels",
    },
    attractions: {
      title: "Attractions",
      content: attractions || {},
      type: "attractions",
    },
    restaurants: {
      title: "Restaurants & Dining",
      content: restaurants || {},
      type: "restaurants",
    },
    costs: {
      title: "Trip Costs Evaluation",
      content: costs || "No costs evaluation available",
      type: "costs",
    },
    dates: {
      title: "Best Dates",
      content: dates || "No dates recommendations available",
      type: "dates",
    },
  }), [summary, hotels, attractions, restaurants, costs, dates]);

  const steps = useMemo(() => Object.values(categories), [categories]);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  console.log(categories.summary.content);
  console.log(categories.hotels.content);

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
         Wish Details
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
      </Paper>
    </div>
  );
};

export default Wish;
