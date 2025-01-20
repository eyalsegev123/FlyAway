const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { upload } = require("../middleware/multer");

// Get all trips of a user
router.get("/getUserTrips/:user_id", tripController.getUserTrips);

router.get("/fetchAlbum/:trip_id", tripController.fetchAlbum)

// Add a new trip by user ID
router.post("/addTrip/:user_id", upload.array('album', 10), tripController.addTrip);

// Delete a trip by trip ID
router.delete("/deleteTrip/:trip_id", tripController.deleteTrip);

// Edit a trip by trip ID
router.post("/editTrip/:trip_id", tripController.editTrip);

module.exports = router;
