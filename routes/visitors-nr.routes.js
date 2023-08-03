const express = require("express");
const router = express.Router();
const visitorsCounterMiddleware = require("../utils/visitors-counter.middleware");

router.post("/visitorsCount", visitorsCounterMiddleware, async (req, res) => {
	res.send({ visitorsCount: req.visitorsCount });
});

module.exports = router;
