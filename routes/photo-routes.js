const express = require("express");
const router = express.Router();
const path = require("path");
const {pool, poolPromise} = require("../utils/database");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get("/category/partiallist", (req, res) => {
	pool.query(
		`SELECT category FROM categories WHERE EXISTS (SELECT category FROM photos WHERE categories.category = photos.category)`,
		(err, results) => {
			if (err) {
				console.log("DB error: ", err);
				return res.send({ error: err.message });
			}
			console.log("partial list reuslt: ", results);
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
		console.log("results: ", results);
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
		`INSERT INTO categories (category) VALUES (?)`,
		[category],
		(error, results, fields) => {
			if (error) {
				console.log(error);
				res.status(500).send({
					message: "Error during creaating new category",
				});
			}
			res.send({
				success: "Ok",
				message: "Photo categories list successfully updated.",
			});
		}
	);
});

router.get("/getPhotoAttributes", (req, res) => {
	pool.query(
		"SELECT * FROM photos WHERE id = ?",
		[req.query.id],
		(error, results, fields) => {
			if (!results || !results[0]) {
				return res.json({ message: "Photo Id not found" });
			}
			const filePath = "/uploads/" + results[0].category;
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
		(error, results, fields) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: error.message });
			}
			const filePath = "../uploads/";
			const options = {
				root: path.join(__dirname, filePath),
			};
			console.log("heroes resulta: = ", results);
			if (!results[0]) {
				return res.status(200).json({
					message: `No photos uploaded yet for category ${req.query.category}`,
				});
			}
			const randomIndex = Math.round(
				Math.random() * (results.length - 1)
			);
			const fileName = results[randomIndex].filename;
			res.sendFile(fileName, options, function (err) {
				if (err) {
					() => {
						console.log("Error while sending file: ", err);
					};
				}
			});
		}
	);
});

router.get("/getPhotoBlob", (req, res) => {
	 pool.query(
		`SELECT * FROM photos WHERE id = '${req.query.id}'`,
        (error, results, fields) => {
            if (error) {
                console.log(error);
				return res.status(500).json({ message: error.message });
            }
            console.log('blob results: ', results)
            const filePath = "../uploads/";
            const options = {
                root: path.join(__dirname, filePath),
            };
            let fileName;
            try {
                fileName = results[0].filename;
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
            console.log('getPhotoListByCategory resuts: ', results)
			res.status(200).send(results);
		}
	);
});

module.exports = router;
