const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");
const s3 = require("./S3Config");

const upload = multer({
  storage: multer.memoryStorage(), // Only keep memory storage, no argument needed
  fileFilter: (req, file, cb) => {
    const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
    const allowedFiles = ["application/pdf", "video/mp4", "video/mpeg"];

    if (
      allowedImages.includes(file.mimetype) ||
      allowedFiles.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, PDF, and MP4 are allowed."
        )
      );
    }
  },
  limits: { fileSize: 80 * 1024 * 1024 }, // 80MB limit
});

// Adjust field names based on frontend
const uploadFields = upload.fields([
  { name: "courseThumbnail", maxCount: 1 },
  { name: "lessonFile", maxCount: 6 }, // Ensure frontend sends "lessonFile"
]);

const ProfileField = upload.single("profileImage");

const uploadToS3 = async (file) => {
  const uniqueName = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${path.extname(file.originalname)}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;
};


// ✅ Export the Upload Functions
module.exports = {
  uploadFields, // Presigned URL Function
  uploadToS3,
  ProfileField, // S3 Upload Function
};
