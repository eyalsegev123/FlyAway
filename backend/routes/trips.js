const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Routes for Trip API
router.get('/', tripController.getAllTrips); // Get all trips
router.post('/', tripController.createTrip); // Create a new trip
router.get('/:id', tripController.getTripById); // Get a specific trip by ID
router.put('/:id', tripController.updateTrip); // Update a trip by ID
router.delete('/:id', tripController.deleteTrip); // Delete a trip by ID

module.exports = router;