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

                console.log("Moving file from: ", oldKey, "to: ", newKey);
                await s3.send(new CopyObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    CopySource: `${process.env.S3_BUCKET_NAME}/${oldKey}`,
                    Key: newKey
                }));
                console.log("Deleting file: ", oldKey, " from tmp");
                await s3.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: oldKey
                }));
            }

            const albumPath = `s3://${process.env.S3_BUCKET_NAME}/${s3BasePath}`;
            await pool.query(
                `UPDATE trips SET album_s3location = $1 WHERE trip_id = $2`,
                [albumPath, trip_id
                ]
            );
            console.log("Updated folder in db");
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
    const { trip_name, start_date, end_date, stars, review } = req.body;

    try {
        const result = await pool.query(
            `UPDATE trips SET trip_name = $1, start_date = $2, end_date = $3, stars = $4, review = $5 WHERE trip_id = $6 RETURNING *`,
            [trip_name, start_date, end_date, stars, review, trip_id]
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

const getAlbumLocation = async (trip_id) => {
    try {
        const result = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [trip_id]);
        if (result.rows.length > 0) {
            const albumLocationInS3 = result.rows[0].album_s3location;
            if (!albumLocationInS3) {
                throw new Error("No album location found for this trip");
            }
            return albumLocationInS3;
        } else {
            throw new Error("No trip with this trip_id");
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw error; // Throw the original error
    }
};


const fetchPhotosFromS3 = async (albumLocation) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME, // Replace with your bucket name
    Prefix: albumLocation // this should be the folder path in your bucket
  };

  try {
    const s3Data = await s3.listObjectsV2(params).promise();
    const imagePromises = s3Data.Contents.map(async file => {
        const imageParams = {
          Bucket: params.Bucket,
          Key: file.Key
        };
        const imageData = await s3.getObject(imageParams).promise();
        // Optionally convert the image data to base64 if needed
        const base64Image = Buffer.from(imageData.Body).toString('base64');
        return `data:image/jpeg;base64,${base64Image}`;
      });
      return await Promise.all(imagePromises);
    } catch (error) {
      console.error('Error fetching photos from S3:', error);
      throw new Error('Failed to fetch photos');
    }
};

const fetchAlbum = async (req, res) => {
    const { trip_id } = req.params;
    try {
        const albumLocation = await getAlbumLocation(trip_id);
        const photoData = await fetchPhotosFromS3(albumLocation);
        res.status(200).json({ photos: photoData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching trip album location" });
    }
};

module.exports = {
  addTrip,
  deleteTrip,
  getUserTrips, 
  editTrip,
  fetchAlbum,
};