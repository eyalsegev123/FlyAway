import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";
import CategoryCard from "../components/CategoryCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessageBox from "../components/MessageBox";
import styled from "styled-components";
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

// Styled components
const RecommendationContainer = styled.div`
  display: flex;
  justify-content: center; /* Keep this to center horizontally */
  padding: 20px;
  margin: 160px auto 0; /* Top margin of 160px, auto left/right */
  box-sizing: border-box;
  width: 100%;
  max-width: 1400px; /* Constrains maximum width */
  margin-left: auto; /* Ensures symmetrical left margin */
  margin-right: auto; /* Ensures symmetrical right margin */

  @media (max-width: 768px) {
    margin-top: 120px;
    padding: 15px;
  }
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 24px;
  margin: 0 auto; /* Ensures the paper is centered within container */
  display: flex;
  flex-direction: column;
`;

const RecommendationTitle = styled(Typography)`
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const AdditionalDetailsContainer = styled(Box)`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
    fromPlanTrip,
  } = location.state || {};
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [wishName, setWishName] = useState("");
  const [notes, setNotes] = useState("");

  // Message box state
  const [messageBox, setMessageBox] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  // Function to create recommendation header using styled component
  const recommendationHeader = (title) => (
    <RecommendationTitle variant="h4" gutterBottom>
      {title}
    </RecommendationTitle>
  );

  useEffect(() => {
    if (tripRecommendation?.answer) {
      const parsed = parseOpenAIResponse(tripRecommendation.answer);
      setParsedResponse(parsed);
    }
  }, [tripRecommendation]);

  // Your existing categories memo
  const categories = useMemo(
    () => ({
      // Your existing categories code
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
    }),
    [parsedResponse]
  );

  // Your existing functions
  const showMessage = (message, type = "success") => {
    setMessageBox({
      isVisible: true,
      message,
      type,
    });
  };

  const closeMessage = () => {
    setMessageBox({
      isVisible: false,
      message: "",
      type: "success",
    });
  };

  const handleWishlistSubmit = async () => {
    // Your existing wishlist submit code
    const userId = user?.id;
    try {
      const response = await axios.post(
        `http://localhost:5001/api/wishesRoutes/addToWishList`,
        {
          user_id: parseInt(userId, 10),
          destination,
          startDate,
          endDate,
          tripGenres,
          tripLength,
          budget,
          wishName,
          notes,
          tripRecommendation,
        }
      );
      if (response.status === 201) {
        showMessage("Added to your wish list!");
        setTimeout(() => {
          navigate("/MyWishlist");
        }, 2000);
        return true;
      } else {
        throw new Error("Failed to add to wish list");
      }
    } catch (error) {
      console.error("An error occurred while adding to your wish list:", error);
      showMessage("An error occurred while adding to your wish list.", "error");
      return false;
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
      <RecommendationContainer>
        <p>No recommendations found.</p>
      </RecommendationContainer>
    );
  }

  return (
    <RecommendationContainer>
      <StyledPaper elevation={3}>
        {fromPlanTrip
          ? recommendationHeader("Your Trip Recommendations")
          : recommendationHeader("Your Wish Details")}

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

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

        <CategoryCard
          title={steps[activeStep].title}
          content={steps[activeStep].content}
          type={steps[activeStep].type}
        />

        {user && fromPlanTrip && (
          <AdditionalDetailsContainer>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <TextField
              label="Name Your Wish"
              variant="outlined"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              sx={{ mb: 1, width: "90%" }}
            />
            <TextField
              label="Notes"
              variant="outlined"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2, width: "90%" }}
            />
            <WishlistButton onAddToWishlist={handleWishlistSubmit}>
              Add to Wishlist
            </WishlistButton>
          </AdditionalDetailsContainer>
        )}

        <MessageBox
          isVisible={messageBox.isVisible}
          message={messageBox.message}
          type={messageBox.type}
          onClose={closeMessage}
        />
      </StyledPaper>
    </RecommendationContainer>
  );
};

export default Recommendation;
