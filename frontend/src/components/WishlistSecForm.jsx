import React, { useState } from 'react';

const WishlistSecForm = ({ onSubmit, onCancel }) => {
  const [wishName, setWishName] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="wishlist-form-container">
      <input
        type="text"
        placeholder="Wish Name"
        value={wishName}
        onChange={(e) => setWishName(e.target.value)}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={() => onSubmit(wishName, notes)}>OK</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default WishlistSecForm;
