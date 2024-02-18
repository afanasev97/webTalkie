const { WebSocket } = require("ws");

const log = console.log;
const userName = "Ilia";
const ws = new WebSocket(`ws://127.0.0.1:8031?username=${userName}`);

const testMsg = "Privet timur!\nKak ti?";

ws.on("error", console.error);

ws.on("open", function open() {
	ws.send(formatMsg(testMsg, "Timur"));
});

ws.on("message", onMessage);

/* outcome functions */
// TODO запретить клиенту отправлять пустые сообщения
function formatMsg(userMsg, destination) {
	const formattedMsg = {
		type: "message",
		header: {
			destination
		},
		msg: userMsg.split("\n")
	};
	return JSON.stringify(formattedMsg);
}

/* income functions */

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
		case "message": handleMessage(msg.body, msg.header?.from); return;
		case "info": handleInfo(msg.header?.info, msg.body); return;
		case "error": handleError(msg.header?.error, msg.body); return;
		default: log("Unknown message type: " + msg.type);
	}
}

function handleMessage(msgBody, from) {
	if (!msgBody ||
		!from) return;
	const msgToShow = `${from}:\n${msgBody}`;
	log(msgToShow);
}

function handleInfo(headerInfo, info) {
	if (!headerInfo ||
		!info) return;
	const msgToShow = `${headerInfo}:\n${info}`;
	log(msgToShow);
}

function handleError(headerError, errorBody) {
	if (!headerError ||
		!errorBody) return;
	const errorToShow = `${headerError}:\n${errorBody}`;
	console.error(errorToShow);
}
