const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../utils/database");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get("/category/partiallist", async (req, res) => {
	console.log("parital");
	let categoriesLIstResponse;
	try {
		categoriesLIstResponse = await db.query(
			`SELECT category FROM categories WHERE EXISTS (SELECT category FROM photos WHERE categories.category = photos.category)`
		);
	} catch (error) {
		console.log("error: ", error);
		res.status(500).send({ message: "Error during fetching categories" });
	}
	res.send(categoriesLIstResponse[0].map((el) => el.category));
});

router.get("/category/fulllist", async (req, res) => {
	let categoriesLIstResponse;
	try {
		categoriesLIstResponse = await db.query(
			`SELECT category FROM categories`
		);
	} catch (error) {
		console.log("error: ", error);
		res.status(500).send({ message: "Error during fetching categories" });
	}
	res.send(categoriesLIstResponse[0].map((el) => el.category));
});

router.post("/category/update", async (req, res) => {
	if (req.headers.jwttoken) {
		try {
			jwt.verify(req.headers.jwttoken, jwtSecretKey);
		} catch (error) {
			console.log(error);
			return res.json({ error: "Unauthorized access" });
		}
	}
	const category = req.body.category;
	try {
		categoryUpdateResponse = await db.query(
			`INSERT INTO categories (category) VALUES (?)`,
			[category]
		);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Error during creaating new category",
		});
	}
	res.send({
		success: "Ok",
		message: "Photo categories list successfully updated.",
	});
});

router.get("/getPhotoAttributes", async (req, res) => {
	const photoAttributes = await db.query(
		"SELECT * FROM photos WHERE id = ?",
		[req.query.id]
	);
	if (!photoAttributes[0] || !photoAttributes[0][0]) {
		return res.json({ message: "Photo Id not found" });
	}
	const filePath = "/uploads/" + photoAttributes[0][0].category;
	const options = {
		root: path.join(__dirname, filePath),
	};
	res.status(200).send(photoAttributes[0]);
});

router.get("/getHeroPhotoByCategory", async (req, res) => {
	if (!req.query.category) {
		return res.send({ message: "server error" });
	}
	let heroPhotos;
	try {
		heroPhotos = await db.query(
			`SELECT * FROM photos WHERE category = '${req.query.category}'`
		);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
	const filePath = "../uploads/";
	const options = {
		root: path.join(__dirname, filePath),
	};
	if (!heroPhotos[0][0]) {
		return res.status(200).json({
			message: `No photos uploaded yet for category ${req.query.category}`,
		});
	}
	const randomIndex = Math.round(Math.random() * (heroPhotos[0].length - 1));
	const fileName = heroPhotos[0][randomIndex].filename;
	res.sendFile(fileName, options, function (err) {
		if (err) {
			() => {
				console.log("Error while sending file: ", err);
			};
		}
	});
});

router.get("/getPhotoBlob", async (req, res) => {
	const photosResponse = await db.query(
		`SELECT * FROM photos WHERE id = '${req.query.id}'`
	);
	const filePath = "../uploads/";
	const options = {
		root: path.join(__dirname, filePath),
	};
    let fileName;
	try {
		fileName = photosResponse[0][0].filename;
	} catch (error) {
		return res.send({ message: "Error occured while reading a file." });
	}

	res.sendFile(fileName, options, function (err) {
		if (err) {
			handleFileError(err);
		}
		function handleFileError(err) {
			console.log("next-error: ", err);
		}
	});
});

router.get("/getPhotoListByCategory", async (req, res) => {
	const galleryList = await db.query(
		`SELECT * FROM photos WHERE category = '${req.query.category}'`
	);
	const filePath = "../uploads/" + req.query.category;
	const options = {
		root: path.join(__dirname, filePath),
	};
	res.status(200).send(galleryList[0]);
});

module.exports = router;
