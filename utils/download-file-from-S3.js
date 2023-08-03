const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const getFileFromS3 = async (filename) => {
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: filename,
		});

		const response = await s3Client.send(command);
		const stream = response.Body;

		return new Promise((resolve, reject) => {
			const chunks = [];
			stream.on("data", (chunk) => chunks.push(chunk));
			stream.on("end", () => {
				const fileBuffer = Buffer.concat(chunks);
				resolve(fileBuffer);
			});
			stream.on("error", (err) => reject(err));
		});
	} catch (err) {
		console.error("Error downloading file:", err);
		throw err;
	}
};

module.exports = { getFileFromS3 };
