"use strict";

var log = console.log;
const { WebSocketServer } = require('ws');

const wsServer = new WebSocketServer({ port: 8031 });
const rawClients = new Map();
const authorizedClients = new Map();
wsServer.on('connection', onConnect);

function onConnect(wsClient, req) {
	const userName = req.url.slice(11);
	if (!userName || (authorizedClients.has(userName))) {
		wsClient.send('Username null or already used');
		wsClient.close(); // TODO reason
		return;
	}

	authorizedClients.set(userName, wsClient)

	wsClient.on('error', (error) => {
		log(`Error: ${error}`)
	});

	wsClient.on('close', (code, reason) => {
		log(`Client: ${userName}`)
		log(`disconnected with code: ${code}`)
		if (String(reason)) log(`disconnected reason: ${String(reason)}`)
		authorizedClients.delete(userName);

		// TODO del from authorizedClients
	});

	wsClient.on('message', onMessage);


	wsClient.send('something');
}


function onMessage(data) {
	try {
		const incomeMsg = JSON.parse(data.toString());
		processMessage(incomeMsg);
	} catch (e) {
		log(`Error parsing incomming msg Error: ${e}`);
		log(`data: ${data}`);
	}
}


function processMessage(msg) {
	if (!msg.type) return;
	switch (msg.type) {
		case 'message': handleMessage(msg.body, msg.header?.destination); return;
		case 'info': handleInfo(msg.header?.info, msg.body); return;
		default: log('Unknown message type: ' + msg.type);
	}
}

function handleMessage(msgBody, destination) {
	if (!msgBody ||
		!destination) return
	if (authorizedClients.has(destination)) {
		destinationWsClient = authorizedClients.get(destination)
		destinationWsClient.send(msgBody)
	}
}