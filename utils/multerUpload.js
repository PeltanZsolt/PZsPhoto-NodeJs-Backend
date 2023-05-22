const multer = require("multer");
/*
const fs = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const path = "./uploads/" + "/";
		try {
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
		} catch (err) {
			console.log("Multer error:", err);
		}
		cb(null, path);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
var multerUpload = multer({ storage: storage, limits: 10000000 });
module.exports = { multerUpload };
*/

const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
	region: "eu-west-1",
	credentials: {
		accessKeyId: "AKIAWQDLPZFIMURXBEN3",
		secretAccessKey: "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",
	},
});

const s3clientStorage = multer.memoryStorage({});
const s3clientUpload = multer({ storage: s3clientStorage });

module.exports = { s3Client, s3clientUpload };
