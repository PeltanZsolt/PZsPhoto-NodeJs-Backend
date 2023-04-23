const express = require("express");
const router = express.Router();
const xss = require("xss");
const db = require("../utils/database");
const multerUpload = require("../utils/multerUpload");
const adminAuthCheckMiddleware = require("../utils/admin-authorization-check.middleware");

router.post(
	"/upload",
	adminAuthCheckMiddleware,
	multerUpload.single("file"),
	async (req, res, next) => {
		const photoAttributes = JSON.parse(req.body.photoAttributes);
		const newPhotoAttributes = Object.values(photoAttributes).map(
			(attribute) => xss(String(attribute))
		);

		newPhotoAttributes[0] = req.file.filename; // Get randomized filename from Multer

		try {
			[imageUploadResult] = await db.query(
				`INSERT INTO photos (filename, title, category, description, year, place, viewsNr, averageRating) VALUES (?)`,
				[newPhotoAttributes]
			);
		} catch (error) {
			const path =
				"../uploads/" +
				photoAttributes.category +
				"/" +
				newPhotoAttributes.filename;
			fs.unlink(path, (error) => {
				console.log("Unlink error: ", error.code);
				res.status(500).send(error.code);
			});
			console.log("Database error:", error);
			return res.send(error);
		}
		res.status(201).send({
			message: "Upload successful.",
		});
	}
);

module.exports = router;
