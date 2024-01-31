var log = console.log;
const { WebSocketServer } = require('ws');



const wsServer = new WebSocketServer({ port: 8031 });
const rawClients = new Map();
const authorizedClients = new Map();
wsServer.on('connection', onConnect);

function onConnect(wsClient, req) {
	log(this)
	clientAddress = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
	rawClients.set(clientAddress, wsClient)
	wsClient.on('error', () => {
		rawClients.delete(clientAddress);
	});
	wsClient.on('close', (code, reason) => {
		log(`Client: ${req.socket.remoteAddress}:${req.socket.remotePort}`)
		log(`disconnected with code: ${code}`)
		if (String(reason)) log(`disconnected reason: ${String(reason)}`)
		rawClients.delete(clientAddress);
	});

	wsClient.on('message', onMessage);


	wsClient.send('something');
}

function onMessage(data) {
	const msgToShow = data.toString();
	log(`new data received:\n ${msgToShow}`);
}