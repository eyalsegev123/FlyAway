const pool = require("../config/db"); // Database connection

// Add a new trip
exports.addTrip = async (req, res) => {
    const {user_id} = req.params;
    const { tripName, destination, startDate, endDate, album, stars, review} = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO trips (user_id, review, stars, destination, trip_name, album, start_date, end_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [user_id, review, stars, destination, tripName, album, startDate, endDate]
        );
        res.status(201).json(result.rows[0]); // Send the created trip
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding trip" });
    }
};

// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
    const { trip_id } = req.params;

    try {
        const result = await pool.query("DELETE FROM trips WHERE trip_id = $1 RETURNING *", [trip_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json({ message: "Trip deleted successfully", trip: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting trip" });
    }
};

// Get all trips of a user
exports.getUserTrips = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM trips WHERE user_id = $1", [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching trips" });
    }
};

// Delete all trips of a user
exports.deleteAllUserTrips = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query("DELETE FROM trips WHERE user_id = $1 RETURNING *", [user_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "No trips found for the user" });
        }

        res.status(200).json({ message: "All trips deleted successfully", deletedTrips: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting trips" });
    }
};

// Add photos to the album of a trip
exports.addPhotosToAlbum = async (req, res) => {
    const { user_id, trip_id } = req.params;
    const { photos } = req.body; // Expecting an array of photo URLs

    try {
        // Fetch the current album
        const result = await pool.query("SELECT album FROM trips WHERE user_id = $1 AND trip_id = $2", [user_id, trip_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const currentAlbum = result.rows[0].album || [];
        const updatedAlbum = [...currentAlbum, ...photos]; // Append new photos to the album

        // Update the album in the database
        await pool.query("UPDATE trips SET album = $1 WHERE trip_id = $2", [updatedAlbum, trip_id]);

        res.status(200).json({ message: "Photos added to album", album: updatedAlbum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding photos to album" });
    }
};

// Get a trip by ID
exports.getTripByUserIdAndName = async (req, res) => {
    const { user_id, trip_name } = req.params;

    try {
        const result = await pool.query("SELECT * FROM trips WHERE user_id = $1 AND trip_name = $2", [user_id , trip_name]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching trip" });
    }
};

// Get trips by destination
exports.getTripsByDestination = async (req, res) => {
    const { destination } = req.params;

    try {
        const result = await pool.query("SELECT * FROM trips WHERE destination = $1", [destination]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching trips by destination" });
    }
};

// Controller: Update a trip (general)
exports.updateTrip = async (req, res) => {
    const { user_id, trip_id } = req.params;
    const { review, stars, destination, trip_name, album, start_date, end_date, trip_genre } = req.body;

    try {
        // Fetch the current trip
        const result = await pool.query("SELECT * FROM trips WHERE user_id = $1 AND trip_name = $2", [user_id , trip_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        const trip = result.rows[0];

        // Update only the provided fields
        const updatedTrip = {
            review: review ?? trip.review,
            stars: stars ?? trip.stars,
            destination: destination ?? trip.destination,
            trip_name: trip_name ?? trip.trip_name,
            album: album ? [...trip.album, ...album] : trip.album, // Add photos to the album
            start_date: start_date ?? trip.start_date,
            end_date: end_date ?? trip.end_date,
            trip_genre: trip_genre ?? trip.trip_genre,
        };

        // Update the database
        const updateResult = await pool.query(
            `UPDATE trips 
             SET review = $1, stars = $2, destination = $3, trip_name = $4, album = $5, start_date = $6, end_date = $7, trip_genre = $8 
             WHERE trip_id = $9 RETURNING *`,
            [
                updatedTrip.review,
                updatedTrip.stars,
                updatedTrip.destination,
                updatedTrip.trip_name,
                updatedTrip.album,
                updatedTrip.start_date,
                updatedTrip.end_date,
                updatedTrip.trip_genre,
                trip_id,
            ]
        );

        res.status(200).json(updateResult.rows[0]); // Send the updated trip
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating trip" });
    }
};

