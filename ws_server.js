"use strict";

const log = console.log;
const { WebSocketServer } = require("ws");
const Client = require("./modules/server/client");

const wsServer = new WebSocketServer({ port: 8031 });
const authorizedClients = new Map();
wsServer.on("connection", onConnect);

function onConnect(wsClient, req) {
	const userName = req.url.slice(11);
	if (!userName || (authorizedClients.has(userName))) {
		wsClient.send("Username null or already used");
		wsClient.close(); // TODO reason
		return;
	}

	const client = new Client(wsClient, userName);
	authorizedClients.set(userName, client);

	wsClient.on("error", (error) => {
		log(`Error: ${error}`);
	});

	wsClient.on("close", (code, reason) => {
		log(`Client: ${userName}`);
		log(`disconnected with code: ${code}`);
		if (String(reason)) log(`disconnected reason: ${String(reason)}`);
		authorizedClients.delete(userName);

		// TODO del from authorizedClients
	});

	wsClient.on("message", (data) => client.onMessage(data));

	wsClient.send("something");
}
