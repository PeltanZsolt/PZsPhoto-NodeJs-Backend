const db = require("./database");

async function calcAverageRating(photoId, newRating) {
	let commentsResponse;
	try {
		commentsResponse = await db.query(
            `SELECT * FROM comments WHERE photoId = ${photoId}`
            );
        } catch (error) {
		console.log("error: ", error);
		return res.status(200).send({ error });
	}
    
	const newRatings = commentsResponse[0].map((comment) => comment.rating);
	newRatings.push(Number(newRating));
	const averageRating =
    newRatings.reduce((accumulator, rating) => accumulator + rating, 0) / newRatings.length;
	return averageRating;
}

module.exports = calcAverageRating;
