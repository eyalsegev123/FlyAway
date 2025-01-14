const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// Add a new trip by user ID
router.post("/addTrip/:user_id", tripController.addTrip);

// Delete a trip by trip ID
router.delete("/:id", tripController.deleteTrip);

// Get all trips of a user
router.get("/getUserTrips/:user_id", tripController.getUserTrips);

// Delete all trips of a user
router.delete("/user/:user_id", tripController.deleteAllUserTrips);

// Add photos to the album of a trip
router.put("/:id/album", tripController.addPhotosToAlbum);

// Get a trip by ID
router.get("/:id", tripController.getTripByUserIdAndName);

// Get trips by destination
router.get("/destination/:destination", tripController.getTripsByDestination);

router.put("/:id", tripController.updateTrip);

module.exports = router;
