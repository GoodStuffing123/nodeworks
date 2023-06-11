import { ConnectedPeer } from "../types";
import { connectedPeers } from "../webConnect";

import { DataPackage, PeerListener, PeerListenerCallback } from "./types";

const peerListeners: PeerListener[] = [];

export const addPeerListener = (
  type: string,
  callback: PeerListenerCallback,
) => {
  const newListener: PeerListener = { type, callback };
  peerListeners.push(newListener);
  return newListener;
};

export const removePeerListener = (oldListener: PeerListener) => {
  const oldListenerIndex = peerListeners.indexOf(oldListener);

  if (oldListenerIndex !== -1) {
    peerListeners.splice(oldListenerIndex, 1);
  }
};

export const broadcast = (
  data: DataPackage,
  connectionList: ConnectedPeer[] = connectedPeers,
) => {
  if (!data.chainHistory) {
    data.chainHistory = [];
  }

  connectionList.forEach((peerConnection) => {
    if (
      peerConnection.user &&
      !data.chainHistory.includes(peerConnection.user.index)
    ) {
      send(data, peerConnection);
    }
  });
};

export const send = async (
  data: DataPackage,
  peerConnection: ConnectedPeer,
  responseCode?: string,
) => {
  peerConnection.connection.send({
    ...data,
    responseCode,
  });
};

let responseCode = 0;
export const sendWithResponse = async (
  data: DataPackage,
  connectedPeer: ConnectedPeer,
  callback: PeerListenerCallback,
) => {
  const responseCodeString = responseCode.toString();

  send(data, connectedPeer, responseCodeString);

  const listener = addPeerListener(
    responseCodeString,
    (data, connectedPeer) => {
      callback(data, connectedPeer);

      removePeerListener(listener);
    },
  );

  responseCode++;
};

const handleData = (data: DataPackage, peerConnection: ConnectedPeer) => {
  const activeListeners = peerListeners.filter(
    (listener) => data.type === listener.type,
  );
  activeListeners.forEach(async (listener) => {
    const res = await listener.callback(data, peerConnection);

    if (data.responseCode) {
      send({ type: data.responseCode, payload: res }, peerConnection);
    }
  });
};

export default handleData;
