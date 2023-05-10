const http = require("http");

function getGttpServer(app) {
	return http.createServer(app);
}

module.exports = getGttpServer;
