const { WebSocketServer } = require("ws");
const Client = require("./client");

module.exports = class Server extends WebSocketServer {
	constructor(port) {
		super({ port });
		this.authorizedClients = new Map();
		this.on("connection", this.onConnect);
	}

	onConnect(wsClient, req) {
		const userName = req.url.slice(11);
		if (!userName || (this.authorizedClients.has(userName))) {
			wsClient.send("Username null or already used");
			wsClient.close(); // TODO reason
			return;
		}

		const client = new Client(wsClient, userName, this);
		this.authorizedClients.set(userName, client);

		wsClient.on("error", (error) => {
			console.log(`Error: ${error}`);
		});

		wsClient.on("close", (code, reason) => {
			console.log(`Client: ${userName}`);
			console.log(`disconnected with code: ${code}`);
			if (String(reason)) console.log(`disconnected reason: ${String(reason)}`);
			this.authorizedClients.delete(userName);

		// TODO del from authorizedClients
		});

		wsClient.on("message", (data) => client.onMessage(data));

		wsClient.send("something");
	}
};
