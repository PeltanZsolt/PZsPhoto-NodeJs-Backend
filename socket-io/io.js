const socketIo = require("socket.io");
let ioInstance;
let socketInstance;

function initIo(server) {
	const io = socketIo(server, {
		cors: { origin: "http://localhost:4201" },
	});
	io.on("connection", (socket) => {
		// const jwttoken = socket.handshake.auth.jwttoken;
		console.log(`Socket ${socket.id} connected`);
		socketInstance = socket;

		socket.on("message", (message) => {
			console.log(`Message received from ${socket.id}: `, message);
			emitMessage(`${socket.id} said: ${message}`);
		});

		socket.on("disconnect", () => {
			console.log(`Socket ${socket.id} disconnected`);
		});
	});

	if (!io) {
		throw new Error("Socket.io not initialized!");
	}

	ioInstance = io;
}

function emitMessage(message) {
	ioInstance.volatile.emit("message", message);
}

function getSocketInstance() {
	return socketInstance;
}

module.exports = { initIo, emitMessage, getSocketInstance };
