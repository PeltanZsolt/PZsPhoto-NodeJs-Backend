const { pool } = require("../utils/database");

async function updateAverageRating(photoId, newAverageRating) {
	pool.query(
		`UPDATE photos SET averageRating = ${newAverageRating} WHERE id = ${photoId}`,
		(error, results, fields) => {
			if (error) {
				console.log(error);
				return false;
			}
			return true;
		}
	);
}

module.exports = updateAverageRating;
