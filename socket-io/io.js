const socketIo = require("socket.io");
let ioInstance;
let socketInstance;
let connectedClients = 0;

function initIo(server) {
	const io = socketIo(server, {
		cors: { origin: "*" },
	});
	io.on("connection", (socket) => {
		console.log(`Socket ${socket.id} connected`);
		socketInstance = socket;

		connectedClients++;
		emitNonvolatileMessage({
			messageSubject: "Clients count changed",
			connectedClients: connectedClients,
		});

		socket.on("message", (message) => {
			console.log(`Message received from ${socket.id}: `, message);
			emitVolatileMessage(`${socket.id} said: ${message}`);
		});

		socket.on("disconnect", () => {
			console.log(`Socket ${socket.id} disconnected`);
			connectedClients--;
            emitNonvolatileMessage({
                messageSubject: "Clients count changed",
                connectedClients: connectedClients,
            });
		});
	});

	if (!io) {
		throw new Error("Socket.io not initialized!");
	}

	ioInstance = io;
}

function emitVolatileMessage(message) {
	ioInstance.volatile.emit("message", message);
}

function emitNonvolatileMessage(message) {
    ioInstance.emit("message", message)
}

function getSocketInstance() {
	return socketInstance;
}

module.exports = { initIo, emitNonvolatileMessage, emitVolatileMessage,  getSocketInstance };
