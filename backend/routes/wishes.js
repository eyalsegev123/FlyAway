const express = require('express');
const router = express.Router();
const {
  getWishesByUserId,
  getWishByUserIdAndName,
  getWishByUserIdAndDestination,
  addWishlist,
  deleteWishlist,
  editWishlist,
} = require('../controllers/wishController'); // Import the controller

// Define routes

// Get all wishes of a specific user
router.get('/user/:user_id', getWishesByUserId);

// Get a specific wish of a user by name
router.get('/user/:user_id/name/:name', getWishByUserIdAndName);

// Get a specific wish of a user by destination
router.get('/user/:user_id/destination/:destination', getWishByUserIdAndDestination);

// Add a new wishlist
router.post('/user/:user_id', addWishlist);

// Delete a wishlist
router.delete('/:wish_id', deleteWishlist);

// Edit a wishlist
router.put('/:wish_id', editWishlist);

module.exports = router;
