import React from 'react';

const HomeTripCard = ({ trip, onSelect, isDisabled }) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect(trip);
    }
  };

  return (
    <div 
      className="home-trip-card" 
      onClick={handleClick}
      style={{ cursor: isDisabled ? 'default' : 'pointer' }}
    >
      <img src={trip.image} alt={trip.destination} />
      <div className="card-content">
        <h3>{trip.destination}</h3>
        <p>{trip.description}</p>
      </div>
    </div>
  );
};

export default HomeTripCard;