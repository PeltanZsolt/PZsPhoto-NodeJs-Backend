const express = require("express");
const router = express.Router();
const xss = require("xss");
const { pool } = require("../utils/database");

router.post("/viewsNr/increment", async (req, res) => {
	const photoId = xss(req.body.photoId);

	pool.query(
		`UPDATE photos SET viewsNr = viewsNr + 1 WHERE id = ${photoId};
      SELECT * FROM photos WHERE id = ${photoId};`,
		(error, results, fields) => {
			if (error) {
				console.log(error);
				return res.status(500).send({ error });
			}
			res.status(200).json({ viewsNr: results[1][0].viewsNr });
		}
	);
});

module.exports = router;
