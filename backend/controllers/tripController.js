const pool = require("../config/db"); // Database connection
const upload = require ('../middleware/multer');
const uploadFiles = upload.array('album'); // Define multer middleware outside

exports.addTrip = async (req, res) => {
    const { user_id } = req.params; // Extract user_id from the request parameters
    const { tripName, destination, startDate, endDate, stars, review } = req.body;

    try {
        // Step 1: Insert the trip and get the generated trip_id
        const tripResult = await pool.query(
            `INSERT INTO trips (user_id, review, stars, destination, trip_name, start_date, end_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING trip_id`,
            [user_id, review, stars, destination, tripName, startDate, endDate]
        );

        const trip_id = tripResult.rows[0].trip_id; // Get the generated trip_id
        req.body.trip_id = trip_id; // Set trip_id for the middleware

        console.log(`Trip created with ID: ${trip_id}`);

        // Step 2: Use multer middleware to handle file uploads dynamically
        uploadFiles(req, res, async (err) => {
            if (err) {
                console.error("File upload error:", err.message);
                return res.status(400).json({ error: err.message });
            }

            console.log("Files uploaded successfully:", req.files);

            // Step 3: Update the album path in the database
            const albumPath = `s3://${process.env.S3_BUCKET_NAME}/user_${user_id}/trip_${trip_id}/`;
            await pool.query(
                `UPDATE trips SET album_s3location = $1 WHERE trip_id = $2`,
                [albumPath, trip_id]
            );

            // Step 4: Respond with the updated trip details
            const updatedTrip = await pool.query(`SELECT * FROM trips WHERE trip_id = $1`, [trip_id]);

            res.status(201).json({
                trip: updatedTrip.rows[0],
            });
        });
    } catch (error) {
        console.error("Error adding trip:", error.message);
        res.status(500).json({ error: "Error adding trip" });
    }
};


// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
    //delete in s3 also
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

