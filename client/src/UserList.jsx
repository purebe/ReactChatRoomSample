import { useState, useEffect } from 'react';

const refreshList = (socket) => {
  socket.send(JSON.stringify({
    command: 'USER_LIST'
  }));
};

export function UserList({ socket }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', (event) => {
        const pData = JSON.parse(event.data);
        if (pData.command === 'S_USER_LIST') {
          setUsers(pData.data);
        }
      });

      if (socket.readyState === WebSocket.CONNECTING) {
        socket.addEventListener('open', (event) => {
          refreshList(socket);
        });
      } else {
        refreshList(socket);
      }
    }
  }, [socket]);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      width: '240px',
      margin: '1rem 0',
      overflowY: 'scroll'
    }}>
      {users.map((user, index) => (
        <p key={index}>
          {user}
        </p>
      ))}
    </div>
  );
};
