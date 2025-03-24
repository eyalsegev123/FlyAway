const pool = require("../config/db");
const { CopyObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../middleware/multer'); // Export s3 from your multer file
const path = require('path');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



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
                [albumPath, trip_id]
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

const deleteTrip = async (req, res) => {
    const { trip_id } = req.params;

    try {
        // Step 1: Get the album location from the database
        let albumLocation;
        try {
            albumLocation = await getAlbumLocation(trip_id);
            // Fix the album location format for S3 operations
            albumLocation = albumLocation.replace('s3://'+process.env.S3_BUCKET_NAME+'/', '');
        } catch (error) {
            console.log("No album found or error getting album location:", error.message);
            // Continue with trip deletion even if we couldn't get the album
            albumLocation = null;
        }

        // Step 2: If we have an album location, delete all objects in that location
        if (albumLocation) {
            try {
                await deleteS3Album(albumLocation);
                console.log(`Successfully deleted all photos in ${albumLocation}`);
            } catch (s3Error) {
                console.error("Error deleting S3 album:", s3Error);
                // Continue with trip deletion even if S3 deletion fails
            }
        }

        // Step 3: Delete the trip from the database
        const result = await pool.query("DELETE FROM trips WHERE trip_id = $1 RETURNING *", [trip_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.status(200).json({ 
            message: "Trip deleted successfully", 
            trip: result.rows[0],
            albumDeleted: albumLocation ? true : false 
        });
    } catch (error) {
        console.error("Error deleting trip:", error);
        res.status(500).json({ error: "Error deleting trip" });
    }
};

// Helper function to delete all objects in an S3 location
const deleteS3Album = async (albumLocation) => {
    // List all objects with the album prefix
    const listParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: albumLocation
    };

    try {
        const listCommand = new ListObjectsV2Command(listParams);
        const listedObjects = await s3.send(listCommand);

        // If no objects found, return early
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log("No objects found to delete");
            return;
        }

        // Prepare the objects for deletion
        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
                Objects: listedObjects.Contents.map(object => ({ Key: object.Key })),
                Quiet: false
            }
        };

        // Delete the objects
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        const deleteResult = await s3.send(deleteCommand);
        
        console.log(`Successfully deleted ${deleteResult.Deleted.length} objects from S3`);

        // Check if we need to handle pagination (if there are more objects)
        if (listedObjects.IsTruncated) {
            console.log("More objects to delete, handling pagination...");
            // Recursively delete remaining objects
            await deleteS3Album(albumLocation);
        }
    } catch (error) {
        console.error("Error in deleteS3Album:", error);
        throw error;
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
	console.log('Album location:', albumLocation);
  const params = {
    Bucket: process.env.S3_BUCKET_NAME, 
    Prefix: albumLocation // this should be the folder path in your bucket
  };

  try {
    const listCommand = new ListObjectsV2Command(params);
    const s3Data = await s3.send(listCommand);
    
    // Add null check before mapping
    if (!s3Data.Contents || s3Data.Contents.length === 0) {
        console.log('No photos found in the album');
        return []; // or handle empty bucket case as needed
    }

    const photoPromises = s3Data.Contents.map(async file => {
        // Skip folder objects (they end with '/')
        if (file.Key.endsWith('/')) {
          return null;
        }
  
        try {
          const getObjectCommand = new GetObjectCommand({
            Bucket: params.Bucket,
            Key: file.Key
          });
          
          // Generate a pre-signed URL (valid for 1 hour)
          const presignedUrl = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
          
          return {
            url: presignedUrl,
            key: file.Key,
            // Extract just the filename from the full path
            filename: file.Key.split('/').pop()
          };
        } catch (err) {
          console.error(`Error generating signed URL for ${file.Key}:`, err);
          return null;
        }
      });
      
      // Filter out any null values from folder objects or errors
      const photos = (await Promise.all(photoPromises)).filter(photo => photo !== null);
      return photos;
    } catch (error) {
      console.error('Error fetching photos from S3:', error);
      throw new Error('Failed to fetch photos');
    }
};

const fetchAlbum = async (req, res) => {
    const { trip_id } = req.params;
    try {
        const albumLocation = await getAlbumLocation(trip_id);
        const fixedAlbumLocation = albumLocation.replace('s3://'+process.env.S3_BUCKET_NAME+'/', '');
        const photos = await fetchPhotosFromS3(fixedAlbumLocation);
        res.status(200).json({ photos });
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