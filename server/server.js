import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 9123 });

let id = Math.round(Math.random() * 64035);
let sockets = new Map();

const setUsername = (sid, data) => {
	let uniqueSuffix = '';
	for (let [socketId, conn] of sockets) {
		if (conn.username === data.data) {
			uniqueSuffix = '-' + Math.round(Math.random() * sid);
		}
	}
	const conn = sockets.get(sid);
	conn.username = `${data.data}${uniqueSuffix}`;
	conn.socket.send(JSON.stringify({
		command: 'S_SET_USERNAME',
		data: conn.username
	}));
};

const sendMessage = (sid, data) => {
	const sconn = sockets.get(sid);
	for (let [socketId, conn] of sockets) {
		conn.socket.send(JSON.stringify({
			command: 'S_SEND_MESSAGE',
			data: `${sconn.username}: ${data.data}`
		}));
	}
};

wss.on('connection', function connection(ws) {
	let sid = id++;
	sockets.set(sid, {
		host: false,
		username: sid,
		socket: ws
	});
	console.log(`${sid} - connection was opened.`);

	ws.on('message', function message(data) {
		console.log('received: %s', data);
		console.log(`${sid} - received message '${data}'`);
		const pData = JSON.parse(data);
		switch (pData.command) {
			case 'SET_USERNAME':
				setUsername(sid, pData);
				break;
			case 'SEND_MESSAGE':
				sendMessage(sid, pData);
				break;
		}
	});

	ws.on('close', function() {
		console.log(`${sid} - connection was closed.`);
	});
});
