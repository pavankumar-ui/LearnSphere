const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");
const s3 = require("./S3Config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "jpeg", "png", "pdf", "mp4"],
  },
});


const upload = multer({
  storage: multer.memoryStorage({storage}),
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedFiles = ['application/pdf', 'video/mp4', 'video/mpeg'];

    if (allowedImages.includes(file.mimetype) || allowedFiles.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and MP4 are allowed.'));
    }
  },
  limits: { fileSize: 1024 * 1024 }   // 1MB limit for images
});

const uploadToS3 = async (file) => {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;
};

/*const generatePresignedUrl = async (fileKey) => {
  const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey
  });

  const url = await getSignedUrl(S3Client, command, { expiresIn: 3600 });  // URL valid for 1 hour
  return url;
};*/


/*const url = await generatePresignedUrl("lesson-content/1742967029295-363982161.mp4");
console.log("Pre-signed URL:", url);*/ 

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },    // Image → Cloudinary
  { name: "file", maxCount: 1 }      // Video/PDF → S3
]);

// ✅ Export the Upload Functions
module.exports = {
   uploadFields, // Presigned URL Function
uploadToS3          // S3 Upload Function
};
