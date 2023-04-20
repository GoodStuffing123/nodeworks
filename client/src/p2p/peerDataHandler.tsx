import { DataConnection } from "peerjs";
import { peerConnections } from "./webConnect";

// Declare types
export interface DataPackage {
  type: string,
  payload: any,
};

export interface PeerListener {
  type: string,
  callback: Function,
}

const peerListeners: PeerListener[] = [];

export const addPeerListener = (type: string, callback: Function) => {
  const newListener = { type, callback };
  peerListeners.push(newListener);
  return newListener;
}

export const removePeerListener = (oldListener: PeerListener) => {
  const oldListenerIndex = peerListeners.indexOf(oldListener);

  if (oldListenerIndex !== -1) {
    peerListeners.splice(oldListenerIndex, 1);
  }
}

export const broadcast = (data: DataPackage) => {
  peerConnections.forEach((peerConnection) => {
    peerConnection.send(data);
  });
}

const handleData = (data: DataPackage, peerConnection: DataConnection) => {
  const activeListeners = peerListeners.filter((listener) => data.type === listener.type);
  activeListeners.forEach((listener) => {
    listener.callback(data.payload, peerConnection);
  })
}

export default handleData;
