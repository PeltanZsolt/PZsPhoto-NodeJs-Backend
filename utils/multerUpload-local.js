const fs = require("fs").promises;
const multer = require("multer");
const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const path = "./Files/";
		try {
			await fs.mkdir(path, { recursive: true });
		} catch (err) {
			console.log("Multer error:", err);
		}
		cb(null, path);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
var multerUploadLocal = multer({ storage: storage, limits: 10000000 });

module.exports = multerUploadLocal;
