const express = require("express");
const router = express.Router();

const authRoutes = require("./auth-routes");
const visitorsNrRoutes = require("./visitors-nr.routes");
const photoRoutes = require("./photo-routes");
const uploadRoutes = require("./upload-routes");
const commentRoutes = require("./comment-routes");
const viewsNrRoutes = require("./views-nr.routes");
const saveFileLocally = require("./save-file-locally");

router.use("/", authRoutes);
router.use("/", photoRoutes);
router.use("/", uploadRoutes);
router.use("/", commentRoutes);
router.use("/", visitorsNrRoutes);
router.use("/", viewsNrRoutes);
router.use("/", saveFileLocally);

router.get("*", (req, res) => {
	res.status(404).json({ error: "Localhost: Page not found." });
});

module.exports = router;
