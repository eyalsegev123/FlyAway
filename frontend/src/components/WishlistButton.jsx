import React, { useState } from 'react';
import '../styles/components/WishlistButton.css'; // Ensure this path is correct for your project structure

const WishlistButton = ({ onAddToWishlist }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    if (!isAdded) {
      onAddToWishlist(); // This function should be passed down from the parent and handle the actual addition logic
      setIsAdded(true); // Update the button state to reflect that the item has been added
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-button ${isAdded ? 'added' : ''}`}
      aria-pressed={isAdded} // Improved accessibility by indicating the state of the button
    >
      <span className="heart-icon">{isAdded ? '✔' : '❤'}</span> {/* Toggle icon based on state */}
      {isAdded ? 'Added to Wishlist' : 'Add to My Wishlist'}
    </button>
  );
};

export default WishlistButton;
