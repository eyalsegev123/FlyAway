const express = require('express');
const router = express.Router();
const {
  getWishesByUserId,
  addToWishlist,
  deleteFromWishlist,
  editWish,
} = require('../controllers/wishController');

// Define routes

// Get all wishes of a specific user
router.get('/getUserWishes/:user_id', getWishesByUserId);

// Add a new wishlist
router.post('/addToWishlist', addToWishlist);

// Delete a wishlist
router.delete('/deleteWish/:wish_id', deleteFromWishlist);

//update wish name and notes if necessary
router.post('/editWish/:wish_id', editWish);

module.exports = router;
