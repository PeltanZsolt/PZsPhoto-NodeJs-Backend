const express = require("express");
const router = express.Router();
const path = require("path");
const { pool, poolPromise } = require("../utils/database");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const AWS = require("aws-sdk");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");

router.get("/category/partiallist", (req, res) => {
	pool.query(
		`SELECT category FROM categories WHERE EXISTS (SELECT category FROM photos WHERE categories.category = photos.category)`,
		(err, results) => {
			if (err) {
				console.log("DB error: ", err);
				return res.send({ error: err.message });
			}
			// console.log("partial list reuslt: ", results);
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
		// console.log("results: ", results);
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
		async (error, results, fields) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: error.message });
			}

			/// start S3 getObject
			console.log("results[0].filename:=", results[0].filename);
			const {
				downloadFileFromS3,
			} = require("../utils/download-file-from-S3");
			const blob = await downloadFileFromS3(results[0].filename);
			console.log("blob: ", blob);

			// res.set(
			// 	"Content-Disposition",
			// 	`attachment; filename="${results[0].filename}"`
			// ); // Set the filename in the response headers
			// const stream = require('stream')

			// stream.pipe(res); // Pipe the S3 stream to the response object
			// res.sendFile(results[0].filename);
			res.contentType("image/jpeg");
			// res.contentType("application/octet-stream");
			res.send(blob);
			// res.send(Buffer.from(blob, "binary"));
			// const s3Client = new S3Client({
			// 	region: "eu-west-1",
			// 	credentials: {
			// 		accessKeyId: "AKIAWQDLPZFIMURXBEN3",
			// 		secretAccessKey: "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",
			// 	},
			// });

			// const command = new GetObjectCommand(params);
			// s3Client.send(command);

			// const filePath = "../uploads/";
			// const options = {
			// 	root: path.join(__dirname, filePath),
			// };
			// // console.log("heroes resulta: = ", results);
			// if (!results[0]) {
			// 	return res.status(200).json({
			// 		message: `No photos uploaded yet for category ${req.query.category}`,
			// 	});
			// }
			// const randomIndex = Math.round(
			// 	Math.random() * (results.length - 1)
			// );
			// const fileName = results[randomIndex].filename;
			// res.sendFile(fileName, options, function (err) {
			// 	if (err) {
			// 		() => {
			// 			console.log("Error while sending file: ", err);
			// 		};
			// 	}
			// });
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
			console.log("blob results: ", results);
			const filename = results[0].filename;
			console.log("file to read: ", filename);

			/// start S3 getObject

			const params = {
				Bucket: "pzsphoto-bucket",
				Key: filename,
			};

			const command = new GetObjectCommand(params);
			const stream = s3Client.send(command);

			stream.on("error", (err) => {
				console.error("Error retrieving file from S3:", err);
				res.status(500).json({ error: "Error retrieving file" });
			});

			stream.on("httpHeaders", (statusCode, headers) => {
				res.set({
					"Content-Length": headers["content-length"],
					"Content-Type": headers["content-type"],
				});
			});

			stream.on("data", (chunk) => {
				res.write(chunk);
			});

			stream.on("end", () => {
				res.end();
			});

			// const s3Params = {
			// 	Bucket: process.env.BUCKETEER_BUCKET_NAME,
			// 	Key: key,
			// };
			// console.log("s3params: ", s3Params);
			// console.log('credentials: ', {
			// 	accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
			// 	secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
			// 	region: process.env.BUCKETEER_AWS_REGION,
			// })
			// const s3 = new AWS.S3({
			// 	accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
			// 	secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
			// 	region: process.env.BUCKETEER_AWS_REGION,
			// });
			// const fileStream = s3.getObject(s3Params).createReadStream();
			// // console.log("filestream =", fileStream);
			// console.log("filename key: ", key);
			// // console.log("after res.attachement");
			// try {
			//     res.attachment(key);
			// 	fileStream.pipe(res);
			// } catch (error) {
			// 	console.log('fileastream pipe error: ', error);
			// }
			// console.log("after filestrearmpipe");

			///
			// const filePath = "../uploads/";
			// const options = {
			// 	root: path.join(__dirname, filePath),
			// };
			// let fileName;
			// try {
			// 	fileName = results[0].filename;
			// } catch (error) {
			// 	return res.send({
			// 		message: "Error occured while reading a file.",
			// 	});
			// }

			// res.sendFile(fileName, options, function (err) {
			// 	if (err) {
			// 		handleFileError(err);
			// 	}
			// 	function handleFileError(err) {
			// 		console.log("next-error: ", err);
			// 	}
			// });
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
			// console.log('getPhotoListByCategory resuts: ', results)
			res.status(200).send(results);
		}
	);
});

module.exports = router;
