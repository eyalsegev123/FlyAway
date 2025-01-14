const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configure AWS SDK
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION,
});


// Test S3 connection
s3.listBuckets((err, data) => {
    if (err) {
      console.error("S3 Initialization Error:", err.message);
    } else {
      console.log("S3 Buckets:", data.Buckets);
    }
});


// Multer-S3 Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME, // Bucket name from .env
    acl: 'public-read', // Access control for the files
    key: (req, file, cb) => {
        const { user_id } = req.params; // Extract user_id and trip_id from the request
        const { trip_id } = req.body;
        const folderPath = `user_${user_id}/trip_${trip_id}/`; // S3 folder structure
        const filePath = `${folderPath}${file.originalname}`;
        cb(null, filePath); // Save file to the specific folder
    },
  }),
  
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

module.exports = upload;
