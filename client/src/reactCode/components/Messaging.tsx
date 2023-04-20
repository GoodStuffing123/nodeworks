import React, { useState, useEffect } from "react";
import { connect } from "../../p2p/webConnect";
import { addPeerListener, removePeerListener } from "../../p2p/peerDataHandler";
import { sendMessage, Message } from "../../p2p/messages";

const emptyMessage: Message = {
  content: "",
  sentAt: Date.now(),
};

const App = () => {
  const [connected, setConnected] = useState(false);
  const [peerConnections, setPeerConnections] = useState([]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(emptyMessage);

  const handleConnect = () => {
    setConnected(true);

    connect(setPeerConnections);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendMessage(newMessage, messages, setMessages);

    setNewMessage(emptyMessage);
  }

  useEffect(() => {
    const messageListener = addPeerListener("MESSAGE", (data: Object) => {
      setMessages([...messages, data]);
    });

    return () => {
      removePeerListener(messageListener);
    }
  }, [messages]);

  return (
    <>
      <h1>Chat box.</h1>

      <div>
        {messages.map((msg) => (
          <p key={msg.sentAt}>{msg.content}</p>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage.content}
          onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
        />
        <input type="submit" value="Send" />
      </form>

      {!connected && (
        <button
          onClick={handleConnect}
        >Connect</button>
      )}

      {peerConnections.map((peerConnection) => <p key={peerConnection.peer}>{peerConnection.peer}</p>)}
    </>
  );
}

export default App;
