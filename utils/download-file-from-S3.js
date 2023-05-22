const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
	region: "eu-west-1",
	credentials: {
		accessKeyId: "AKIAWQDLPZFIMURXBEN3",
		secretAccessKey: "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",
	},
});
const downloadFileFromS3 = async (filename) => {
	try {
		const params = {
			Bucket: "pzsphoto-bucket",
			Key: filename,
		};
		const command = new GetObjectCommand({
			Bucket: "pzsphoto-bucket",
			Key: filename,
		});
		// const command = new GetObjectCommand(params);
		const response = await s3Client.send(command);
		console.log("response S3: =", response);
		const stream = response.Body;
		console.log("stream: =", response.Body);

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

module.exports = {
	downloadFileFromS3,
};
