const log = console.log;

module.exports = class Client {
	constructor(socket, userName) {
		this.socket = socket;
		this.userName = userName;
	}

	onMessage(data) {
		try {
			const incomeMsg = JSON.parse(data.toString());
			this.processMessage(incomeMsg);
		} catch (e) {
			log(`Error parsing incomming msg Error: ${e}`);
			log(`data: ${data}`);
		}
	}

	processMessage(msg) {
		if (!msg.type) return;
		switch (msg.type) {
			case "message": this.handleMessage(msg.body, msg.header?.destination); return;
			case "info": this.handleInfo(msg.header?.info, msg.body); return;
			default: log("Unknown message type: " + msg.type);
		}
	}

	handleMessage(msgBody, destination) {
		if (!msgBody ||
		!destination) return;
		if (authorizedClients.has(destination)) {
			const destinationWsClient = authorizedClients.get(destination);
			destinationWsClient.sendMsg(msgBody, destination); // TODO who sender???
		}
	}

	handleInfo(info, body) {
		if (!info) return;
		switch (info) {
			case "who": {
				const msgObj = {
					type: "info",
					header: {
						info: "online clients:"
					},
					body: Array.from(authorizedClients.keys())
				};
				const msgToSend = JSON.stringify(msgObj);
				this.send(msgToSend);
			}
				break;
			default: log("Unknow info request" + info);
		}
	}

	sendMsg(msgBody, destination) {
		const msgToSend = Client.formatMsg(msgBody, destination);
		this.sendData(msgToSend);
	}

	sendData(data) {
		this.socket.send(data);
	}

	static formatMsg(userMsg, destination) {
		const formattedMsg = {
			type: "message",
			header: {
				destination
			},
			msg: userMsg.split("\n")
		};
		return JSON.stringify(formattedMsg);
	}
};
