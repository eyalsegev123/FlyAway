import React, { useState } from 'react';
import '../styles/components/WishlistButton.css'; // Path to your CSS file for styling
import WishlistSecForm from './WishlistSecForm';

const WishlistButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (wishName, notes) => {
    // Handle form submission
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="wishlist-button">
        <span className="heart-icon">❤</span> Add to My Wishlist
      </button>
      <WishlistSecForm 
        open={isModalOpen}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default WishlistButton;