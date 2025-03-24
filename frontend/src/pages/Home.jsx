import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import HomeTripCard from "../components/HomeTripCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/pages/Home.css";
import parisImage from '../assets/paris.jpeg';
import tokyoImage from '../assets/tokyo.jpg';
import newyorkImage from '../assets/newyork.webp';
import telavivImage from '../assets/Tel-Aviv-beach.jpg';
import premierLeagueImage from  '../assets/lion.jpg'
import thailandImage from '../assets/thailand.jpg'
import styled from 'styled-components';
import LoadingTripGlobe from "../components/LoadingTripGlobe";
import axios from "axios";
import apiService from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // References for request handling
  const abortControllerRef = useRef(null);
  const threadIdRef = useRef(null);
  
  // Cleanup function to abort any pending request when component unmounts or route changes
  useEffect(() => {
    return () => {
      // If there's an active request when the component unmounts, abort it
      if (abortControllerRef.current) {
        console.log("Aborting OpenAI request due to navigation");
        abortControllerRef.current.abort();
        
        // If we have a thread ID, also clean it up on the server
        if (threadIdRef.current) {
          apiService.cancelRequest(threadIdRef.current).catch(err => console.error("Failed to cancel request on server:", err));
        }
      }
    };
  }, [location.pathname]); // Re-run when path changes
  
  const trips = [
    {
      id: 1,
      destination: "Paris",
      description: "Romantic vacation in the city of lights",
      image: parisImage,
      tripGenres: ["Romantic", "Restaurants", "Culture"],
      travelers: "Couple"
    },
    {
      id: 2,
      destination: "Tokyo",
      description: "Families culinary trip",
      image: tokyoImage,
      tripGenres: ["Culinary", "Restaurants", "Food markets"],
      travelers: "Families"
    },
    {
      id: 3,
      destination: "Tel Aviv",
      description: "Nightlife in the City That Never Sleeps",
      image: telavivImage,
      tripGenres: ["Nightlife", "Parties", "Clubs", "Festivals", "Trance festivals", "Electric festivals", "Shows"],
      travelers: "Friends"
    },
    {
      id: 4,
      destination: "New York",
      description: "Shopping with friends in the Big-City life",
      image: newyorkImage,
      tripGenres: ["Shopping", "Culture"],
      travelers: "Friends"
    },
    {
      id: 5,
      destination: "Thailand",
      description: "Beaches honeymoon in the islands",
      image: thailandImage,
      tripGenres: ["Honeymoon", "Restaurants", "Beaches", "Parties", "Festivals", "Culture"],
      travelers: "Couple"
    },
    {
      id: 6,
      destination: "England",
      description: "Football trip with your friends",
      image: premierLeagueImage,
      tripGenres: ["Football matches", "Sport events", "Sport activity", "Premier League"],
      travelers: "Friends"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  
  // This function will be triggered when a trip card is clicked
  const handleTripSelection = async (trip) => {
    setLoading(true);
    
    // Predefined trip details
    const predefinedTripDetails = {
      destination: trip.destination,
      startDate: new Date().toISOString().split('T')[0], // Today
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Week from today
      tripLength: "7",
      budget: "2000",
      currency: "USD",
      tripGenres: trip.tripGenres,
      travelers: trip.travelers,
      additionalNotes: "None additional notes"
    };
    
    try {
      // Create a new AbortController
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      // Setup a timeout to check for thread ID
      const checkThreadIdInterval = setInterval(async () => {
        if (threadIdRef.current) {
          clearInterval(checkThreadIdInterval);
        }
      }, 500);
      
      // Make the request
      const response = await apiService.planTrip(predefinedTripDetails, { signal });
      
      // Clear the interval if it's still running
      clearInterval(checkThreadIdInterval);
      
      if (response.status === 200) {
        // Clear the refs once request is done
        abortControllerRef.current = null;
        threadIdRef.current = null;
        
        // Convert tripGenres array to string
        const tripGenresString = Array.isArray(trip.tripGenres) 
          ? trip.tripGenres.join(", ") 
          : trip.tripGenres;
          
        // Navigate to recommendation page
        navigate("/Recommendation", {
          state: { 
            tripRecommendation: response.data,
            destination: trip.destination,
            startDate: predefinedTripDetails.startDate,
            endDate: predefinedTripDetails.endDate,
            tripGenres: tripGenresString,
            tripLength: predefinedTripDetails.tripLength,
            budget: predefinedTripDetails.budget,
            fromPlanTrip: true,
          }
        });
      }
    } catch (err) {
      // Only show error if it's not an abort error
      if (!axios.isCancel(err)) {
        console.error("Error planning trip:", err);
      } else {
        console.log("Request was cancelled");
      }
    } finally {
      // Only update loading state if component is still mounted
      // and the request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <StyledWrapper>
      {loading ? (
        <LoadingTripGlobe />
      ) : (
        <StyledModal>
          <div className="homepage-container">
            <div className="homepage-main">
              <h1 className="carousel-title">Quick AI Recommendations</h1>
              <div className="carousel-container">
                <Slider {...settings}>
                  {trips.map((trip) => (
                    <HomeTripCard 
                      key={trip.id} 
                      trip={trip}
                      onSelect={handleTripSelection}
                      isDisabled={loading}
                    />
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </StyledModal>
      )}
    </StyledWrapper>
  );
};

const StyledModal = styled.div`
  .carousel-title {
    color: white; /* Set the text color to white */
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  background-color: transparent; /* Optional: background color for the page */

  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 1000px; /* Increased maximum width */
    width: 100%; /* Ensure the form takes full width up to the max-width */
    padding: 20px;
    border-radius: 20px;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #00bfff;
  }

  .message {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
  }

  .form-group {
    position: relative;
  }

  .form-group.full-width {
    grid-column: 1 / -1; /* Makes the element take up two columns */
  }

  .form-group .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 5px 5px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form-group .input + span {
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form-group .input:focus + span,
  .form-group .input:valid + span {
    color: #00bfff;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    background-color: #00bfff;
    transition: background-color 0.3s ease;
  }

  .submit:hover {
    background-color: #00bfff96;
  }
  .form-group .input.notes-textarea {
  width: 100%; // Use a fixed width for testing
  max-width: 8000px;
}

  .custom-dropdown {
    position: relative;
    width: 100%;
  }

  .dropdown-button {
    width: 100%;
    text-align: left;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    color: #fff;
    cursor: pointer;
    height: auto;
    padding: 10px 5px 5px 10px;
    min-height: 50px;
    white-space: normal;
    word-wrap: break-word;
  }

  .custom-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #333;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
    margin-top: 5px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Creates three columns of equal width */
    gap: 8px; /* Adds space between the columns and rows */
  }

  .close-dropdown {
    padding: 8px 8px;
    background-color: #00bfff; /* Matching the dropdown background color */
    color: #fff;
    border: none;
    cursor: pointer;
    grid-column: span 3; /* Makes the button span all three columns */
  }


  .custom-dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: #fff;

    &:hover {
      background-color: #444;
    }

    input[type="checkbox"],
    input[type="radio"] {
      margin-right: 8px;
    }

    .checkbox-label,
    .radio-label {
      flex: 1;
    }
  }

  /* Scrollbar styling for the dropdown menu */
  .custom-dropdown-menu::-webkit-scrollbar {
    width: 8px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb {
    background: #00bfff;
    border-radius: 4px;
  }

  .custom-dropdown-menu::-webkit-scrollbar-thumb:hover {
    background: #00bfff96;
  }

  .dropdown-label {
    font-size: 0.85em;
    color: rgba(255, 255, 255, 0.5);
  }

  .textarea-input {
    resize: none;
    min-height: 120px;
    padding-top: 25px !important;
    line-height: 1.5;
    font-family: inherit;
  }

  .textarea-input::placeholder {
    opacity: 0.7;
    font-size: 0.9em;
  }
`;

export default HomePage;