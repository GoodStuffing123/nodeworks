import React, { useEffect, useRef, useState } from "react";
import {
  addPeerListener,
  broadcast,
  removePeerListener,
} from "../../p2p/data/peerDataHandler";

import { dataTypes } from "../../p2p/data/types";

import styled from "styled-components";
import { Self } from "../../p2p/connection/types";

interface ChatMessage {
  username: string;
  content: string;
}

const ChatBoxStyles = styled.div`
  .chat-messages-container {
    height: 20vh;
    overflow-y: scroll;

    .chat-message {
      margin: 10px 0;
      padding: 5px 0;
      border-bottom: 1px solid #444444;

      .username {
        font-size: 10px;
      }

      p {
        font-family: monospace;
        overflow-wrap: break-word;
        white-space: pre-wrap;
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

  const chatMessagesContainerRef = useRef<HTMLDivElement>();
  const messageBoxRef = useRef<HTMLTextAreaElement>();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newMessage: ChatMessage = {
      username: self.user.username,
      content: message,
    };

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
    chatMessagesContainerRef.current.scrollTop =
      chatMessagesContainerRef.current.scrollHeight;

    const messageListener = addPeerListener<ChatMessage>(
      dataTypes.CHAT_MESSAGE,
      (data) => {
        setMessages([...messages, data.payload]);
      },
    );

    return () => {
      removePeerListener(messageListener);
    };
  }, [messages]);

  return (
    <ChatBoxStyles className="bordered-container popup-animation delay-4">
      <div className="verticle-bordered-container">
        <div ref={chatMessagesContainerRef} className="chat-messages-container">
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
