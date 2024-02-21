module.exports = class Client {
	constructor(socket, userName, server) {
		this.socket = socket;
		this.userName = userName;
		this.server = server;
	}

	onMessage(data) {
		try {
			const incomeMsg = JSON.parse(data.toString());
			this.processMessage(incomeMsg);
		} catch (e) {
			console.log(`Error parsing incomming msg Error: ${e}`);
			console.log(`data: ${data}`);
		}
	}

	processMessage(msg) {
		if (!msg.type) return;
		switch (msg.type) {
			case "message": this.server.sendMessageToUser(msg.body, msg.header?.destination); return;
			case "info": this.server.handleInfo(msg.header?.info, msg.body, this); return;
			default: console.log("Unknown message type: " + msg.type);
		}
	}

	sendMsg(msgBody) {
		const msgToSend = Client.formatMsg(msgBody, this.userName);
		this.sendData(msgToSend);
	}

	sendData(data) {
		const serializedData = JSON.stringify(data);
		this.socket.send(serializedData);
	}

	static formatMsg(userMsg, from) {
		const formattedMsg = {
			type: "message",
			header: {
				from
			},
			body: userMsg
		};
		return formattedMsg;
	}
};
