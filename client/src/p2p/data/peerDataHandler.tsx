import { connectedPeers } from "../connection";
import { findRandomConnectedPeerWithIndex } from "../connection/findConnectedPeers";
import { self } from "./user";

import { ConnectedPeer } from "../connection/types";
import { DataPackage, PeerListener, PeerListenerCallback } from "./types";

const peerListeners: PeerListener<any>[] = [];

export const addPeerListener = <T,>(
  type: string,
  callback: PeerListenerCallback<T>,
) => {
  const newListener: PeerListener<T> = { type, callback };
  peerListeners.push(newListener);
  return newListener;
};

export const removePeerListener = (oldListener: PeerListener<any>) => {
  const oldListenerIndex = peerListeners.indexOf(oldListener);

  if (oldListenerIndex !== -1) {
    peerListeners.splice(oldListenerIndex, 1);
  }
};

export const send = (
  data: DataPackage<any>,
  connectedPeer: ConnectedPeer,
  responseCode?: string,
) => {
  const dataToSend: DataPackage<any> = {
    ...data,
    responseCode,
    chainHistory: [...(data?.chainHistory || []), self.peer.id],
  };

  connectedPeer.connection.send(dataToSend);
};

let responseCode = 0;
export const sendWithResponse = <T,>(
  data: DataPackage<any>,
  connectedPeer: ConnectedPeer,
) => {
  const responseCodeString = responseCode.toString();
  responseCode++;

  send(data, connectedPeer, responseCodeString);

  let listener: PeerListener<T>;
  return new Promise<DataPackage<T>>((resolve) => {
    listener = addPeerListener(responseCodeString, (res: DataPackage<T>) => {
      removePeerListener(listener);

      resolve(res);
    });
  });
};

export const sendChain = (data: DataPackage<any>, responseCode: string) => {
  const connectedPeer = findRandomConnectedPeerWithIndex(data.chainHistory);

  if (connectedPeer) {
    send(data, connectedPeer, responseCode);
  } else {
    console.error("No connected peers with index found!");
  }
};

export const sendChainWithResponse = <T,>(data: DataPackage<any>) => {
  const connectedPeer = findRandomConnectedPeerWithIndex(
    data.chainHistory || [],
  );

  return sendWithResponse<T>(data, connectedPeer);
};

export const broadcast = (
  data: DataPackage<any>,
  connectionList: ConnectedPeer[] = connectedPeers,
) => {
  if (!data.chainHistory) {
    data.chainHistory = [];
  }

  connectionList.forEach((peerConnection) => {
    if (
      peerConnection.user &&
      !data.chainHistory.includes(peerConnection.connection.peer)
    ) {
      send(data, peerConnection);
    }
  });
};

const handleData = (data: DataPackage<any>, peerConnection: ConnectedPeer) => {
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
