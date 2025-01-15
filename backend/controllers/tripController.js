const pool = require("../config/db");
const { CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../middleware/multer'); // Export s3 from your multer file
const path = require('path');


// Get all trips of a user
const getUserTrips = async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM trips WHERE user_id = $1", [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching trips" });
    }
};

const addTrip = async (req, res) => {
    const { user_id } = req.params;
    console.log("Files:", req.files); // Log uploaded files
    console.log("Form Data:", req.body); // Log form data

    try {
        const { tripName, destination, startDate, endDate, stars, review } = req.body;

        // Step 1: Insert the trip
        const tripResult = await pool.query(
            `INSERT INTO trips (user_id, review, stars, destination, trip_name, start_date, end_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING trip_id`,
            [user_id, review, stars, destination, tripName, startDate, endDate]
        );

        const trip_id = tripResult.rows[0].trip_id;

        // Step 2: Handle file uploads
        if (req.files && req.files.length > 0) {
            // Create the final S3 path
            const s3BasePath = `user_${user_id}/trip_${trip_id}/`;
            
            // Move files from tmp to final location
            for (const file of req.files) {
                const oldKey = file.key;
                const fileName = path.basename(oldKey);
                const newKey = s3BasePath + fileName;

                await s3.send(new CopyObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    CopySource: `${process.env.S3_BUCKET_NAME}/${oldKey}`,
                    Key: newKey
                }));

                await s3.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: oldKey
                }));
            }

            const albumPath = `s3://${process.env.S3_BUCKET_NAME}/${s3BasePath}`;
            await pool.query(
                `UPDATE trips SET album_s3location = $1 WHERE trip_id = $2`,
                [albumPath, trip_id]
            );
        }

        // Step 3: Return the created trip
        const updatedTrip = await pool.query(`SELECT * FROM trips WHERE trip_id = $1`, [trip_id]);
        res.status(201).json({
            trip: updatedTrip.rows[0],
        });

    } catch (error) {
        console.error("Error adding trip:", error);
        res.status(500).json({ error: "Error adding trip" });
    }
};



// Delete a trip by ID
const deleteTrip = async (req, res) => {
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

const editTrip = async (req, res) => {
    const { trip_id } = req.params;
    const { tripName, destination, startDate, endDate, stars, review } = req.body;

    try {
        const result = await pool.query(
            `UPDATE trips SET trip_name = $1, destination = $2, start_date = $3, end_date = $4, stars = $5, review = $6 WHERE trip_id = $7 RETURNING *`,
            [tripName, destination, startDate, endDate, stars, review, trip_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json({ message: "Trip updated successfully", trip: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating trip" });
    }
};


module.exports = {
  addTrip,
  deleteTrip,
  getUserTrips, 
  editTrip
};