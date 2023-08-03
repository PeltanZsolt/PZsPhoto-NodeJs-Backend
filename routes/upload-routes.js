const express = require("express");
const router = express.Router();
const xss = require("xss");
const { pool } = require("../utils/database");
const { s3Client, s3ClientUpload } = require("../utils/multerUpload");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const getUniqueFilename = require("../utils/get-uuid-filename");
require("dotenv").config();

const adminAuthCheckMiddleware = require("../utils/admin-authorization-check.middleware");

router.post(
	"/upload",
	adminAuthCheckMiddleware,
	s3ClientUpload.single("file"),

	async (req, res, next) => {
		const newFilename = getUniqueFilename(req.file.originalname);
		try {
			const params = {
				Bucket: process.env.S3_BUCKET_NAME,
				Key: newFilename,
				Body: req.file.buffer,
			};

			const command = new PutObjectCommand(params);
			await s3Client.send(command);
		} catch (err) {
			console.error("Error uploading file:", err);
			res.status(500).json({ error: "Error uploading file" });
		}

		const photoAttributes = JSON.parse(req.body.photoAttributes);
		const newPhotoAttributes = Object.values(photoAttributes).map(
			(attribute) => xss(String(attribute))
		);

		newPhotoAttributes[0] = newFilename;

        console.log('sanitized: ', newPhotoAttributes)

		pool.query(
			`INSERT INTO photos (filename, title, category, description, year, place, viewsNr, averageRating) VALUES (?)`,
			[newPhotoAttributes],
			(error, results, fields) => {
				if (error) {
					console.log("Database error:", error);
					return res.send({
						error: `File uploaded to cloud storage but failed to record on database:  ${JSON.stringify(
							error
						)}`,
					});
				}
                console.log('results: ', results)
				res.status(201).send({
					message: "Upload successful.",
				});
			}
		);
	}
);

module.exports = router;
