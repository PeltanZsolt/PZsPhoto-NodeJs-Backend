const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const { pool } = require("../utils/database");
const { getFileFromS3 } = require("../utils/download-file-from-S3");

router.get("/category/partiallist", (req, res) => {
	pool.query(
		`SELECT category FROM categories WHERE EXISTS (SELECT category FROM photos WHERE categories.category = photos.category)`,
		(err, results) => {
			if (err) {
				console.log("Database error: ", err);
				return res.send({ error: err.message });
			}
			if (results.length > 0) {
				res.send(results.map((el) => el.category));
			} else {
				res.json({ message: "No categories yet." });
			}
		}
	);
});

router.get("/category/fulllist", (req, res) => {
	pool.query(`SELECT category FROM categories`, (error, results, fields) => {
		if (error) {
			console.log("error: ", error);
			res.status(500).send({
				message: "Error during fetching categories",
			});
		}
		res.send(results.map((el) => el.category));
	});
});

router.post("/category/update", (req, res) => {
	if (req.headers.jwttoken) {
		try {
			jwt.verify(req.headers.jwttoken, jwtSecretKey);
		} catch (error) {
			console.log(error);
			return res.json({ error: "Unauthorized access" });
		}
	}

	const category = req.body.category;

    pool.query(
        'SELECT * from categories WHERE category = ?', [category],
        (error, results, fields) => {
            if (results && results[0]) {
                return res.status(200).send({
                    error: true,
					message: "Category already exists!",
				});
            }

            pool.query(
                `INSERT INTO categories (category) VALUES (?)`,
                [category],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send({
                            error: true,
                            message: "Error during registering new category",
                        });
                    }
                    res.send({
                        success: "Ok",
                        message: "Photo categories list successfully updated.",
                    });
                }
            );
        }
    )

});

router.get("/getPhotoAttributes", (req, res) => {
	pool.query(
		"SELECT * FROM photos WHERE id = ?",
		[req.query.id],
		(error, results, fields) => {
			if (!results || !results[0]) {
				return res.json({ message: "Photo Id not found" });
			}
			res.status(200).send(results);
		}
	);
});

router.get("/getHeroPhotoByCategory", (req, res) => {
	if (!req.query.category) {
		return res.send({ message: "server error" });
	}
	pool.query(
		`SELECT * FROM photos WHERE category = '${req.query.category}'`,
		async (error, results, fields) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: error.message });
			}

			const blob = await getFileFromS3(results[0].filename);
			res.contentType("image/jpeg");
			res.send(blob);
		}
	);
});

router.get("/getPhotoBlob", (req, res) => {
	pool.query(
		`SELECT * FROM photos WHERE id = '${req.query.id}'`,
		async (error, results, fields) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: error.message });
			}

			const blob = await getFileFromS3(results[0].filename);
			res.contentType("image/jpeg");
			res.send(blob);
		}
	);
});

router.get("/getPhotoListByCategory", (req, res) => {
	pool.query(
		`SELECT * FROM photos WHERE category = '${req.query.category}'`,
		(error, results, fields) => {
			if (error) {
				console.log(error);
				return res.json({ error: error.message });
			}
			res.status(200).send(results);
		}
	);
});

module.exports = router;
