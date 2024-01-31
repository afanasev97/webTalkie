const { WebSocket } = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8031');
const userMsg = 'Privet timur!\nKak ti?';

const userName = 'Ilia'

ws.on('error', console.error);

ws.on('open', function open() {
	ws.send(initMsg(userName));
	// ws.send(formatMsg(userName, userMsg, 'timur'));
});

ws.on('message', function message(data) {
	console.log('received: %s', data);
});


function initMsg(userName) {
	const initMessage = {
		header: {
			from: userName,

		},
		type: 'init'
	}
	return JSON.stringify(initMessage)


}
function formatMsg(userName, userMsg, destination) {
	const formattedMsg = {
		header: {
			from: userName,
			to: destination,
			type: 'msg',
		},
		msg: userMsg.split('\n')
	}
	return JSON.stringify(formattedMsg);
}

function makeMsgObj(msg) {
	try {
		msgObject = JSON.parse(msg);
		return msgObject;
	} catch (e) {
		log(e)
	}
}