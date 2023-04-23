const db = require("../utils/database");

async function updateAverageRating(photoId, newAverageRating) {
	try {
		await db.query(
			`UPDATE photos SET averageRating = ${newAverageRating} WHERE id = ${photoId}`
		);
	} catch (error) {
		console.log(error.code);
		return false;
	}
	return true;
}

module.exports = updateAverageRating;
