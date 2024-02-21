const { WebSocketServer } = require("ws");
const Client = require("./client");

module.exports = class Server {
	constructor(port) {
		this.wsServer = new WebSocketServer({ port });
		this.authorizedClients = new Map();
		this.wsServer.on("connection", (wsClient, req) => this.onConnect(wsClient, req));
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
		});

		wsClient.on("message", (data) => client.onMessage(data));
	}

	sendMessageToUser(msgBody, destination) {
		if (!msgBody ||
		!destination) return;
		if (this.authorizedClients.has(destination)) {
			const destinationWsClient = this.authorizedClients.get(destination);
			destinationWsClient.sendMsg(msgBody); // TODO who sender???
		}
	}

	handleInfo(info, body, client) {
		if (!info) return;
		switch (info) {
			case "who": {
				const msgObj = {
					type: "info",
					header: {
						info: "online clients:"
					},
					body: Array.from(this.authorizedClients.keys())
				};
				client.sendData(msgObj);
			}
				break;
			default: console.log("Unknow info request" + info);
		}
	}
};
