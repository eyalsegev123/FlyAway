import React from 'react';
import '../styles/components/WishlistButton.css'; // Path to your CSS file for styling

const WishlistButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="wishlist-button">
      <span className="heart-icon">❤</span> Add to My Wishlist
    </button>
  );
};

export default WishlistButton;