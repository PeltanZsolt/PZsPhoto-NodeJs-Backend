const { express } = require("../utils/express");
const router = express.Router();
const db = require("../utils/database");
const userAuthCheckMiddleware = require("../utils/user-authorization-check.middleware");
const calcAverageRating = require("../utils/calc-average-rating");
const updateAverageRating = require("../utils/update-average-rating");
const { getSocketInstance } = require("../socket-io/io");

router.get("/comment", async (req, res) => {
	const photoId = req.query.photoId.toString();
	let commentResponse;
	try {
		commentResponse = await db.query(
			`SELECT * FROM comments WHERE photoId = ${photoId}`
		);
	} catch (error) {
		console.log("error: ", error);
		return res.status(500).send({ error });
	}

	res.status(200).send(commentResponse[0]);
});

router.post("/comment", userAuthCheckMiddleware, async (req, res) => {
	const newComment = req.body.comment;

	let newCommentAsArray = [
		newComment.photoId,
		newComment.user,
		newComment.commentText,
		Number(newComment.rating),
	];

	try {
		await db.query(
			`INSERT INTO comments (photoId, user, commentText, rating) VALUES (?)`,
			[newCommentAsArray]
		);
	} catch (error) {
		console.log("Database error: ", error);
		return res.send({ error: "Database error" });
	}

	const newAverageRating = calcAverageRating(
		newComment.photoId,
		newComment.rating
	);

	newAverageRating.then((value) => {
		if (!updateAverageRating(newComment.photoId, value)) {
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
});

module.exports = router;
