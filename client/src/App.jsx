import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ChatRoom } from './ChatRoom';

function App() {
  return (
    <div style={{
      width: '100dvw',
      height: '100dvh'}}>
      <ChatRoom roomName={"General"} />
    </div>
  );
}

export default App;
