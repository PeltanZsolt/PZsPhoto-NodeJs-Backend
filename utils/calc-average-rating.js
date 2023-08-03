const { pool } = require("../utils/database");

async function calcAverageRating(photoId, newRating) {
	try {
		const results = await new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM comments WHERE photoId = ${photoId}`,
				(error, results, fields) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		const newRatings = results.map((comment) => comment.rating);
		newRatings.push(Number(newRating));
		const averageRating =
			newRatings.reduce(
				(accumulator, rating) => accumulator + rating,
				0
			) / newRatings.length;
		console.log("new average rating: ", averageRating);
		return averageRating;
	} catch (error) {
		console.log("Error while calculating average rating: ", error);
		return 'error';
	}
}

module.exports = calcAverageRating;
