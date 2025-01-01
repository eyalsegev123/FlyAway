const express = require('express');
const router = express.Router();
const {
  getWishesByUserId,
  getWishesByUserIdAndName,
  getWishesByUserIdAndDestination,
  addToWishlist,
  deleteFromWishlist,
  editWishlist,
} = require('../controllers/wishController'); // Import the controller

// Define routes

// Get all wishes of a specific user
router.get('/getUserWishes/:user_id', getWishesByUserId);

// Get a specific wish of a user by name
router.get('/user/:user_id/name/:name', getWishesByUserIdAndName);

// Get a specific wish of a user by destination
router.get('/user/:user_id/destination/:destination', getWishesByUserIdAndDestination);

// Add a new wishlist
router.post('/addToWishlist', addToWishlist);

// Delete a wishlist
router.delete('/:wish_id', deleteFromWishlist);

// Edit a wishlist
router.put('/:wish_id', editWishlist);

module.exports = router;
