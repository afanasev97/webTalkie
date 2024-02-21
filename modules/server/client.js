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
			case "message": this.handleMessage(msg.body, msg.header?.destination); return;
			case "info": this.handleInfo(msg.header?.info, msg.body); return;
			default: console.log("Unknown message type: " + msg.type);
		}
	}

	handleMessage(msgBody, destination) {
		if (!msgBody ||
		!destination) return;
		if (this.server.authorizedClients.has(destination)) {
			const destinationWsClient = this.server.authorizedClients.get(destination);
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
					body: Array.from(this.server.authorizedClients.keys())
				};
				const msgToSend = JSON.stringify(msgObj);
				this.send(msgToSend);
			}
				break;
			default: console.log("Unknow info request" + info);
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
