const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

// ✅ AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Function to generate S3 signed URL
const generateSignedUrl = async (fileKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
  });

  const metadata = await s3Client.send(command);
  const contentType = metadata.ContentType;
  console.log("COntent Type:", contentType);

  try {
    console.log(`Generating signed URL for ${fileKey}`);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log("Signed URL:", signedUrl);
    return { signedUrl, contentType };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

module.exports = { generateSignedUrl };
