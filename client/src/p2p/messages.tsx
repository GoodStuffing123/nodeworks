import { broadcast, DataPackage } from "./peerDataHandler";

export interface Message {
  content: string,
  sentAt: number,
}

const generateMessage = (newMessage: Message): DataPackage => ({
  type: "MESSAGE",
  payload: {
    ...newMessage,
    sentAt: Date.now(),
  },
});

export const sendMessage = (newMessage: Message, messages: Message[], setMessages: Function) => {
  const dataToSend = generateMessage(newMessage);

  broadcast(dataToSend);

  setMessages([...messages, dataToSend.payload]);
}
