const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();


const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const s3ClientStorage = multer.memoryStorage({});
const s3ClientUpload = multer({ storage: s3ClientStorage });

module.exports = { s3Client, s3ClientUpload };
