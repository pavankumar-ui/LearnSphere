// services/SignedURL.js

const fs = require("fs");
const path = require("path");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
require("dotenv").config();

const generateSignedUrl = async (fileKey) => {
  try {
    const privateKeyPath = path.join(__dirname, "../keys/cloudfront-private-key.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;

    const signedUrl = getSignedUrl({
      url: cloudFrontUrl,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      dateLessThan: new Date(Date.now() + 3600 * 1000), // 1 hour
      privateKey,
    });

    return {
      signedUrl,
      contentType: "video/mp4", // or dynamic if you're storing contentType elsewhere
    };
  } catch (error) {
    console.error("Error generating CloudFront signed URL", error);
    throw error;
  }
};

module.exports = generateSignedUrl;
