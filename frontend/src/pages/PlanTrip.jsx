import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "../styles/pages/PlanTrip.css";
import Header from "../components/Header";
import LoadingTrip from "../components/LoadingTrip";

const PlanTrip = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripLength, setTripLength] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tripGenres, setTripGenres] = useState([]);
  const [travelers, setTravelers] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [additionalNotes, setadditionalNotes] = useState("");
  // const [tripRecommendation, setTripRecommendation] = useState(null);

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);

  const navigate = useNavigate();

  // Toggle genre dropdown
  const handleGenreDropdownToggle = () => {
    setShowGenreDropdown(!showGenreDropdown);
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    setTripGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const startDateParts = startDate.split('/');
    const formattedStartDate = new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`);
    const endDateParts = endDate.split('/');
    const formattedEndDate = new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (tripGenres.length === 0) {
      setErrorMessage("Please select at least one genre for your trip.");
      setLoading(false);
      return;
    }
    if (!travelers) {
      setErrorMessage("Please select the type of travelers you are going to be.");
      setLoading(false);
      return;
    }

    if(formattedEndDate < formattedStartDate) {
      setErrorMessage("The end-date must be later than the start-date.");
      setLoading(false);
      return;
    }
    if(formattedStartDate < currentDate) {
      setErrorMessage("Start date must be in the future.");
      setLoading(false);
      return;
    }
    if(budget <= 0) {
      setErrorMessage("I believe you will need money for you trip.");
      setLoading(false);
      return;
    }
    if(tripLength <= 0) {
      setErrorMessage("Trip length must be positive");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/openAiRoutes/planTrip`,
        {
          destination,
          startDate,
          endDate,
          tripLength,
          budget,
          currency,
          tripGenres,
          travelers,
          additionalNotes
        }
      );

      if (response.status === 200) {
        navigate("/Recommendation", {
          state: {
            tripRecommendation: response.data,
            destination: destination,
            start_range: startDate,
            end_range: endDate,
            trip_genre: tripGenres.join(", "),
            trip_length: tripLength,
            budget: budget,
            travelers: travelers,
            additionalNotes: additionalNotes
          },
        });
      }
    } catch (err) {
      setErrorMessage("An error occurred while submitting the trip details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <Header />
      {loading ? (
        <LoadingTrip />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Plan Your Trip</p>
          <p className="message">Use our tools to plan the perfect vacation for you!</p>
          <div className="form-group">
            <label htmlFor="destination">
              <input
                className="input"
                type="text"
                id="destination"
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              <span>Destination</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">
              <input
                className="input"
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <span>Start Date (Can be dynamic)</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="endDate">
              <input
                className="input"
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <span>End Date (Can be dynamic)</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="tripLength">
              <input
                className="input"
                type="number"
                id="tripLength"
                placeholder="Enter the length of your trip in days"
                value={tripLength}
                onChange={(e) => setTripLength(e.target.value)}
                required
              />
              <span>Length of Trip (in days)</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="budget">
              <input
                className="input"
                type="number"
                id="budget"
                placeholder="Excluding flights !!!"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
              <span>Budget (per person)</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="currency">
              <select
                className="input"
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="NIS">NIS</option>
              </select>
              <span>Currency</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="tripGenres">
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={handleGenreDropdownToggle}
                >
                  {tripGenres.length === 0
                    ? "Select genres"
                    : tripGenres.join(", ")}
                </button>
                {showGenreDropdown && (
                  <div className="dropdown-menu">
                    {["Sport activity", "Sport events" ,"Nightlife", "Restaurants", "Extreme", "Ski and winter sports", "Shopping", "Museums", "Culture", "Festivals", "Electric festivals", "Trance festivals", "Parties",
                     "History", "Chill", "Markets", "Beaches", "Art", "Family roots", "Safair", "Trekking", "Climbing", "Yoga and Meditation", "Cruise", "Food tours", "Views", "Water parks","Gambling and Casino", "Religious Trip", "Organized Trip", "Appointments and Conferences" ].map(
                      (genre) => (
                        <label key={genre} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={tripGenres.includes(genre)}
                            onChange={() => handleGenreChange(genre)}
                          
                          />
                          {genre}
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>
              <span>Trip Genre (Select multiple)</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="travelers">
              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle"
                  onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
                  
                >
                  {travelers || "Select travelers"}
                </button>
                {showTravelersDropdown && (
                  <div className="dropdown-menu">
                    {["Solo (man)", "Solo (woman)", "Couple", "Couples", "Family", "Families", "Friends (Women)", "Friends (Men)",
                    "Friends (Men and Women)", "bachelorette party(Women)", "bachelorette party(Men)","Retires", "Colleagues", 
                    ].map((traveler) => (
                      <label key={traveler} className="dropdown-item">
                        <input
                          type="radio"
                          name="travelers"
                          checked={travelers === traveler}
                          onChange={() => setTravelers(traveler)}
                        />
                        {traveler}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <span>Travelers</span>
            </label>
          </div>
          <div>
          <label>
          <textarea
            className="input notes-textarea"
            value={additionalNotes}
            onChange={(e) => setadditionalNotes(e.target.value)}
            placeholder="Additional notes. It's recommended to define your ages/hotels locations/details which you consider important, etc..."
            rows="4"
            required
          ></textarea>
          <span>Additional Notes</span>
        </label>
        </div>

          <button className="submit" type="submit">
            Plan Trip
          </button>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
      )}
    </StyledWrapper>
    
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  background-color: transparent; /* Optional: background color for the page */

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 600px; /* Increased maximum width */
    width: 100%; /* Ensure the form takes full width up to the max-width */
    padding: 20px;
    border-radius: 20px;
    position: relative;
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
  width: 7000px; // Use a fixed width for testing
  max-width: 8000px;
}
`;

export default PlanTrip;
