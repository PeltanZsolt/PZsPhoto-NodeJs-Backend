const { express } = require("../utils/express");
const router = express.Router();
const userAuthCheckMiddleware = require("../utils/user-authorization-check.middleware");
const calcAverageRating = require("../utils/calc-average-rating");
const updateAverageRating = require("../utils/update-average-rating");
const { getSocketInstance } = require("../socket-io/io");
const { pool } = require("../utils/database");

router.get("/comment", async (req, res) => {
	const photoId = req.query.photoId.toString();

	pool.query(
		`SELECT * FROM comments WHERE photoId = ${photoId}`,
		(error, results, fields) => {
			if (error) {
				console.log(error);
				return res.json({ error: error.message });
			}
			res.status(200).send(results);
		}
	);
});

router.post("/comment", userAuthCheckMiddleware, async (req, res) => {
	const newComment = req.body.comment;

	let newCommentAsArray = [
		newComment.photoId,
		newComment.user,
		newComment.commentText,
		Number(newComment.rating),
	];

	pool.query(
		`INSERT INTO comments (photoId, user, commentText, rating) VALUES (?)`,
		[newCommentAsArray],
		(error, results, fields) => {
			if (error) {
				console.log(error);
				res.status(500).send({
					error: "Database error",
				});
			}

			const newAverageRating = calcAverageRating(
				newComment.photoId,
				newComment.rating
			);

			newAverageRating.then((value) => {
				if (
					value === "error" ||
					!updateAverageRating(newComment.photoId, value)
				) {
					return res.send({ error: "Database error" });
				}

				const message = {
					messageSubject: "New comment posted",
					newComment: newComment,
				};
				getSocketInstance().broadcast.emit("message", message);

				res.status(200).send({
					averageRating: value,
				});
			});
		}
	);
});

module.exports = router;
