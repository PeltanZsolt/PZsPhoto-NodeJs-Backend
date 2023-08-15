const express = require("express");
const router = express.Router();
const multerUploadLocal = require("../utils/multerUpload-local");
require("dotenv").config();
const adminAuthCheckMiddleware = require("../utils/admin-authorization-check.middleware");

router.post(
	"/saveFileLocally",
	adminAuthCheckMiddleware,
	multerUploadLocal.single("file"),
	(req, res, next) => {
		res.status(201).send({
			message: "File saved locally.",
		});
	}
);

module.exports = router;
