import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import apiService from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import { StyledWrapper } from '../styles/sharedStyles';
import "../styles/pages/PlanTrip.css";
import LoadingTripGlobe from "../components/LoadingTripGlobe";

// Form Input Options
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "NIS"];

const TRIP_GENRES = [
  "Sport activity", "Sport events", "Nightlife", "Restaurants", "Extreme",
  "Ski and winter sports", "Shopping", "Museums", "Culture", "Festivals",
  "Electric festivals", "Trance festivals", "Parties", "History", "Chill",
  "Markets", "Beaches", "Art", "Family roots", "Safari", "Trekking",
  "Climbing", "Yoga and Meditation", "Cruise", "Food tours", "Views",
  "Water parks", "Gambling and Casino", "Religious Trip", "Organized Trip",
  "Appointments and Conferences"
];

const TRAVELER_TYPES = [
  "Solo (man)", "Solo (woman)", "Couple", "Couples", "Family", "Families",
  "Friends (Women)", "Friends (Men)", "Friends (Men and Women)",
  "bachelorette party(Women)", "bachelorette party(Men)", "honey moon", "Retires", "Colleagues"
];

// Form Input Components
const FormInput = ({ label, id, isTextarea, ...props }) => (
  <div className="form-group">
    <label htmlFor={id}>
      {isTextarea ? (
        <textarea className="input textarea-input" id={id} {...props} />
      ) : (
        <input className="input" id={id} {...props} />
      )}
      <span>{label}</span>
    </label>
  </div>
);

const DestinationInput = ({ value, onChange }) => (
  <FormInput
    label="Destination"
    id="destination"
    type="text"
    placeholder="Enter your destinations, if you are dynamic write 'anywhere'"
    value={value}
    onChange={(e) => onChange('destination', e.target.value)}
    required
  />
);

const DateInput = ({ id, label, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="date"
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const NumberInput = ({ id, label, placeholder, value, onChange }) => (
  <FormInput
    label={label}
    id={id}
    type="number"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(id, e.target.value)}
    required
  />
);

const CurrencySelect = ({ value, onChange }) => (
  <div className="form-group">
    <label htmlFor="currency">
      <select
        className="input"
        id="currency"
        value={value}
        onChange={(e) => onChange('currency', e.target.value)}
        required
      >
        {CURRENCY_OPTIONS.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
      <span>Currency</span>
    </label>
  </div>
);

const GenreDropdown = ({ genres, showDropdown, onToggle, onChange, className }) => (
  <div className={`form-group ${className}`}>
    <label htmlFor="tripGenres">
      <div className="custom-dropdown">
        <span className="dropdown-label">Trip Genres</span>
        <button
          type="button"
          className="input dropdown-button"
          onClick={onToggle}
        >
          {genres.length === 0 ? "Select genres" : genres.join(", ")}
        </button>
        {showDropdown && (
          <div className="custom-dropdown-menu">
            {TRIP_GENRES.map((genre) => (
              <label key={genre} className="custom-dropdown-item">
                <input
                  type="checkbox"
                  checked={genres.includes(genre)}
                  onChange={() => onChange(genre)}
                />
                <span className="checkbox-label">{genre}</span>
              </label>
            ))}
            <button type="button" className="close-dropdown" onClick={onToggle}>
              Done
            </button>
          </div>
        )}
      </div>
    </label>
  </div>
);

const TravelersDropdown = ({ value, showDropdown, onToggle, onChange, className }) => (
  <div className={`form-group ${className}`}>
    <label htmlFor="travelers">
      <div className="custom-dropdown">
        <span className="dropdown-label">Travelers</span>
        <button
          type="button"
          className="input dropdown-button"
          onClick={onToggle}
        >
          {value || "Select travelers"}
        </button>
        {showDropdown && (
          <div className="custom-dropdown-menu">
            {TRAVELER_TYPES.map((traveler) => (
              <label key={traveler} className="custom-dropdown-item">
                <input
                  type="radio"
                  name="travelers"
                  checked={value === traveler}
                  onChange={() => onChange('travelers', traveler)}
                />
                <span className="radio-label">{traveler}</span>
              </label>
            ))}
            <button type="button" className="close-dropdown" onClick={onToggle}>
              Done
            </button>
          </div>
        )}
      </div>
    </label>
  </div>
);

const NotesTextarea = ({ value, onChange, className }) => (
  <div className={`form-group full-width ${className}`}>
    <label htmlFor="additionalNotes" className="notes-label">
      Additional Notes
    </label>
    <textarea
      id="additionalNotes"
      placeholder="Ages, preferred hotel locations, or any other important details..."
      className="input notes-textarea"
      value={value}
      onChange={(e) => onChange('additionalNotes', e.target.value)}
      rows="4"
    />
  </div>
);


const PlanTrip = () => {
  // Form Data States
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    tripLength: "",
    budget: "",
    currency: "USD",
    tripGenres: [],
    travelers: "",
    additionalNotes: ""
  });

  // UI States
  const [uiState, setUiState] = useState({
    loading: false,
    errorMessage: "",
    showGenreDropdown: false,
    showTravelersDropdown: false
  });

  const navigate = useNavigate();
  const location = useLocation();
  
  // Reference to the AbortController
  const abortControllerRef = useRef(null);
  // Reference to store the thread ID
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
          apiService.cancelRequest(threadIdRef.current)
            .catch(err => console.error("Failed to cancel request on server:", err));
        }
      }
    };
  }, [location.pathname]); // Re-run when path changes

  // Update form data helper
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update UI state helper
  const updateUiState = (field, value) => {
    setUiState(prev => ({ ...prev, [field]: value }));
  };

  // Toggle dropdowns
  const handleGenreDropdownToggle = () => {
    updateUiState('showGenreDropdown', !uiState.showGenreDropdown);
  };

  // Handle genre selection
  const handleGenreChange = (genre) => {
    const newGenres = formData.tripGenres.includes(genre)
      ? formData.tripGenres.filter(item => item !== genre)
      : [...formData.tripGenres, genre];
    updateFormData('tripGenres', newGenres);
  };

  // Form validation
  const validateForm = () => {
    const startDateObj = new Date(formData.startDate);
    const endDateObj = new Date(formData.endDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (formData.tripGenres.length === 0) {
      return "Please select at least one genre for your trip.";
    }
    if (!formData.travelers) {
      return "Please select the type of travelers you are going to be.";
    }
    if (endDateObj < startDateObj) {
      return "The end-date must be later than the start-date.";
    }
    if (startDateObj < currentDate) {
      return "Start date must be in the future.";
    }
    if (formData.budget <= 0) {
      return "I believe you will need money for your trip.";
    }
    if (formData.tripLength <= 0) {
      return "Trip length must be positive";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUiState('loading', true);
    updateUiState('errorMessage', "");

    const validationError = validateForm();
    if (validationError) {
      updateUiState('errorMessage', validationError);
      updateUiState('loading', false);
      return;
    }

    try {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      // Setup a timeout to check for thread ID
      const checkThreadIdInterval = setInterval(async () => {
        if (threadIdRef.current) {
          clearInterval(checkThreadIdInterval);
        }
      }, 500);
      
      // Initiate the request with the signal
      const response = await apiService.planTrip(formData, { signal });

      // Clear the interval if it's still running
      clearInterval(checkThreadIdInterval);

      if (response.status === 200) {
        // Clear the refs once request is done
        abortControllerRef.current = null;
        threadIdRef.current = null;
        
        navigate("/Recommendation", {
          state: {
            tripRecommendation: response.data,
            destination: formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            tripGenres: formData.tripGenres.join(", "),
            tripLength: formData.tripLength,
            budget: formData.budget,
            fromPlanTrip: true,
          },
        });
      }
    } catch (err) {
      // Only show error if it's not an abort error
      if (!axios.isCancel(err)) {
        updateUiState('errorMessage', "An error occurred while submitting the trip details.");
        console.error("Error submitting trip details:", err);
      } else {
        console.log("Request was cancelled");
      }
    } finally {
      // Only update loading state if component is still mounted
      // and the request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        updateUiState('loading', false);
      }
    }
};

  return (
    <StyledWrapper>
      {uiState.loading ? (
        <LoadingTripGlobe />
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <p className="title" >Plan Your Trip</p>
          <p className="message">Use our tools to plan the perfect vacation for you!</p>
          
          <DestinationInput 
            value={formData.destination} 
            onChange={updateFormData} 
          />

          <NumberInput 
            id="tripLength"
            label="Length of Trip (in days)"
            placeholder="Enter the length of your trip in days"
            value={formData.tripLength}
            onChange={updateFormData}
          />

          <NumberInput 
            id="budget"
            label="Budget (per person)"
            placeholder="Excluding flights !!!"
            value={formData.budget}
            onChange={updateFormData}
          />

          <CurrencySelect 
            value={formData.currency} 
            onChange={updateFormData} 
          />
          
          <DateInput 
            id="startDate"
            label="Start Date (Can be dynamic)"
            value={formData.startDate}
            onChange={updateFormData}
          />
          
          <DateInput 
            id="endDate"
            label="End Date (Can be dynamic)"
            value={formData.endDate}
            onChange={updateFormData}
          />  
          
          <GenreDropdown 
            genres={formData.tripGenres}
            showDropdown={uiState.showGenreDropdown}
            onToggle={handleGenreDropdownToggle}
            onChange={handleGenreChange}
            className="form-group full-width"
          />
          
          <TravelersDropdown 
            value={formData.travelers}
            showDropdown={uiState.showTravelersDropdown}
            onToggle={() => updateUiState('showTravelersDropdown', !uiState.showTravelersDropdown)}
            onChange={updateFormData}
            className="form-group full-width"
          />
          
          <NotesTextarea 
            value={formData.additionalNotes} 
            onChange={updateFormData} 
            className="textarea-input form-group full-width"
          />

          <button className="submit form-group full-width" type="submit">
            Plan Trip
          </button>
          {uiState.errorMessage && <p className="error">{uiState.errorMessage}</p>}
        </form>
      )}
    </StyledWrapper>
  );
};

export default PlanTrip;