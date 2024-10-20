import { useState } from 'react';
import { UserList } from './UserList';

export function ChatRoom({roomName}) {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setText(e.currentTarget.value);
  };

  const sendMessage = () => {
    if (socket != null) {
      socket.send(JSON.stringify({
        command: 'SEND_MESSAGE',
        data: text
      }));
      setText('');
    }
  };

  const changeUsername = (e) => {
    setUsername(e.currentTarget.value);
  };

  const connect = (e) => {
    let ws = new WebSocket("wss://gaming.purebe.com/listen");
    setSocket(ws);

    ws.addEventListener('open', (event) => {
      console.log("[open] connection established");
      ws.send(JSON.stringify({
        command: 'SET_USERNAME',
        data: username
      }));
    });

    ws.addEventListener('close', (event) => {
      console.log('[close] connection closed');
      setSocket(null);
    });

    ws.addEventListener('message', (event) => {
      const pData = JSON.parse(event.data);
      if (pData.command === 'S_SEND_MESSAGE') {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          {
            timestamp: new Date().toLocaleTimeString('en-US'),
            username: pData.data.username,
            message: pData.data.message
          }
        ]);
      } else if (pData.command === 'S_SET_USERNAME') {
        setUsername(pData.data);
      }
    });
  };

  const start = (e) => {
    if (socket) {
      socket.send(JSON.stringify({
        command: 'START_GAME'
      }));
    }
  };

  const connectDisable = socket ? true : false;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexFlow: 'column nowrap'}}>
      <div style={{
        display: 'flex',
        margin: '1rem 1rem 0 1rem'}}>
        <input placeholder={'Username'} value={username} onChange={changeUsername} />
        <button onClick={connect} disabled={connectDisable}>Connect</button>
      </div>
      <div style={{
        display: 'flex',
        flex: 2
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          margin: '1rem 0',
          padding: '0 1rem',
          overflowY: 'scroll',
          textAlign: 'left',
          flex: 2}}>
          {chatHistory.map((c, index) => (
            <p key={index} style={{
            }}>
              <span style={{
                color: 'red',
                fontStyle: 'italic',
                paddingRight: '0.5rem'
              }}>
                {c.timestamp}
              </span>
              <span style={{
                fontWeight: 'bold',
                paddingRight: '0.5rem'
              }}>
                {c.username}:
              </span>
              <span>
                {c.message}
              </span>
            </p>
          ))}
        </div>
        <UserList socket={socket} />
      </div>
      <div style={{
        display: 'flex',
        margin: '0 1rem 1rem 1rem'}}>
        <input
          style={{
            flex: 2
          }}
          value={text}
          onChange={handleTyping}
          onKeyDown={onKeyDown} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

