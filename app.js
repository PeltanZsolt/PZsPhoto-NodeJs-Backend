const cors = require("cors");
const routes = require("./routes/routes");
const { express, app } = require("./utils/express");
require("dotenv").config();

const httpServer = require("./utils/http-server")(app);

const {initIo} = require("./socket-io/io");
initIo(httpServer);

app.use(cors());
app.use(express.json());
app.use(routes);

const HOST = process.env.HOST;
const PORT = process.env.PORT;
httpServer.listen(PORT, HOST, () => {
	console.log(
		`PZsPhoto backend started at http://${HOST}:${PORT}. Waiting for requests...`
	);
});
