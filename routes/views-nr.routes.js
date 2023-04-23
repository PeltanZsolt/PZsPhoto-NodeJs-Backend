const express = require('express');
const router = express.Router();
const xss = require("xss");
const db = require("../utils/database");

router.post("/viewsNr/increment", async (req, res) => {
	const photoId = xss(req.body.photoId);
	let viewsNrResponse;
	try {
		viewsNrResponse = await db.query(
			`UPDATE photos SET viewsNr = viewsNr + 1 WHERE id = ${photoId};
      SELECT * FROM photos WHERE id = ${photoId};`
		);
	} catch (error) {
		console.log("error: ", error);
		return res.status(500).send({ error });
	}
	res.status(200).json({ viewsNr: viewsNrResponse[0][1][0].viewsNr });
});

module.exports = router;