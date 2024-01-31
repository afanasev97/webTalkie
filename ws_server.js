var log = console.log;
const { WebSocketServer } = require('ws');



const wsServer = new WebSocketServer({ port: 8031 });
const rawClients = new Map();
const authorizedClients = new Map();
wsServer.on('connection', onConnect);

function onConnect(wsClient) {
	clientAddress = `${wsClient._socket.remoteAddress}:${wsClient._socket.remotePort}`;
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

	wsClient.on('message', (data) => onMessage(data, wsClient));


	wsClient.send('something');
}

function onMessage(data, wsClient) {
	let msgObj = JSON.parse(String(data));
	let msgType = msgObj.type
	if (msgType == 'init') {
		authorizedClients.set(msgObj.header.from, wsClient)
	}
}