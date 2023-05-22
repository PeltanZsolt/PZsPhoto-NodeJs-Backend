const { v4: uuidv4 } = require("uuid");

function uniqueFilename(originalFilename) {
    const extension = originalFilename.split(".").pop();
    const newFilename = `${uuidv4()}.${extension}`
	return newFilename;
}

module.exports = uniqueFilename;
