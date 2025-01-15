const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require("@aws-sdk/credential-providers");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configure AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv()
});

// Test S3 connection
const testS3Connection = async () => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log("S3 Buckets:", data.Buckets);
  } catch (err) {
    console.error("S3 Initialization Error:", err.message);
  }
};

testS3Connection();

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

// Multer-S3 Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const user_id = req.params.user_id;
      // Generate a timestamp-based unique identifier for the trip
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      const s3Path = `user_${user_id}/tmp/${fileName}`;
      cb(null, s3Path);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: fileFilter
});

module.exports = {upload, s3};
