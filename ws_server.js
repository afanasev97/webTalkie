var log = console.log;
const { WebSocketServer } = require('ws');



const wsServer = new WebSocketServer({ port: 8031 });
const clients = new Map();
wsServer.on('connection', onConnect);

function onConnect(wsClient, req) {
	clientAddress = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
	clients.set(clientAddress, wsClient)
	wsClient.on('error', () => {
		clients.delete(clientAddress);
	});

	wsClient.on('message', onMessage);


	wsClient.send('something');
}

function onMessage(data) {
	const msgToShow = data;
	clients.set(msg)
	log(`new data received from client ${msgToShow.header.from}\ndestination: ${msgToShow.header.to}\n`, msgToShow.msg.reduce((acc, string) => acc += (string + '\n'), ''));
}