const { WebSocket } = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8031');
const userMsg = 'Privet timur!\nKak ti?';

ws.on('error', console.error);

ws.on('open', function open() {
	ws.send(formatMsg(userMsg, 'timur'));
});

ws.on('message', function message(data) {
	console.log('received: %s', data);
});


function initMsg() {

}
function formatMsg(userMsg, destination) {
	const formattedMsg = {
		header: {
			from: 'ilia',
			to: destination
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