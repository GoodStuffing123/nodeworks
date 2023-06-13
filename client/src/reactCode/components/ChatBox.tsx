import React, { useEffect, useRef, useState } from "react";
import {
  addPeerListener,
  broadcast,
  removePeerListener,
} from "../../p2p/data/peerDataHandler";

import { dataTypes } from "../../p2p/data/types";
import { Self } from "../../p2p/database/types";

import styled from "styled-components";

interface ChatMessage {
  username: string;
  content: string;
}

const ChatBoxStyles = styled.div`
  .chat-message-container {
    height: 40vh;
    overflow-y: scroll;

    .chat-message {
      margin: 10px 0;
      padding: 5px 0;
      border-bottom: 1px solid #444444;

      .username {
        font-size: 10px;
      }

      p {
        overflow-wrap: break-word;
        margin: 0;
      }
    }
  }

  textarea {
    width: 100%;
    overflow: hidden;
  }
`;

const ChatBox = ({ self }: { self: Self }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messageBoxRef = useRef<HTMLTextAreaElement>();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessage: ChatMessage = { username: self.name, content: message };

    broadcast({
      type: dataTypes.CHAT_MESSAGE,
      payload: newMessage,
    });

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const MessageBox = messageBoxRef.current;
    MessageBox.style.height = "0px";
    MessageBox.style.height = `${messageBoxRef.current.scrollHeight}px`;
  }, [message]);

  useEffect(() => {
    const messageListener = addPeerListener(dataTypes.CHAT_MESSAGE, (data) => {
      setMessages([...messages, data.payload]);
    });

    return () => {
      removePeerListener(messageListener);
    };
  }, [messages]);

  return (
    <ChatBoxStyles className="bordered-container">
      <div className="verticle-bordered-container">
        <div className="chat-message-container">
          {messages.map((message, i) => (
            <div key={i} className="chat-message">
              <span className="username">{message.username}</span>
              <p>{message.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            ref={messageBoxRef}
            placeholder="message"
            value={message}
            onChange={handleMessageChange}
          />

          <button type="submit">send</button>
        </form>
      </div>
    </ChatBoxStyles>
  );
};

export default ChatBox;
