const express = require("express");
const router = express.Router();

const authRoutes = require("./auth-routes");
const visitorsNrRoutes = require("./visitors-nr.routes");
const photoRoutes = require("./photo-routes");
const uploadRoutes = require('./upload-routes')
const commentRoutes = require('./comment-routes')
const viewsNrRoutes = require('./views-nr.routes')

router.use("/", authRoutes);
router.use("/", photoRoutes);
router.use('/', uploadRoutes)
router.use('/', commentRoutes)
router.use("/", visitorsNrRoutes);
router.use('/', viewsNrRoutes)

router.get("*", (req, res) => {
	res.status(404).json({ error: "Not page found ." });
});

module.exports = router;
