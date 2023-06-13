import { connectedPeers } from "../connection/webConnect";

import { ConnectedPeer } from "../connection/types";
import {
  DataPackage,
  dataTypes,
  PeerListener,
  PeerListenerCallback,
} from "./types";

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
  connectedPeer: ConnectedPeer,
  responseCode?: string,
) => {
  connectedPeer.connection.send({
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
  // if (data.type !== dataTypes.PING) {
  //   console.log("SENDING REQUEST AND EXPECTING A RESPONSE", data);
  // }

  const responseCodeString = responseCode.toString();

  send(data, connectedPeer, responseCodeString);

  const listener = addPeerListener(
    responseCodeString,
    (cbdata, connectedPeer) => {
      // if (data.type !== dataTypes.PING) {
      //   console.log("RESPONSE RECIEVED", data);
      // }

      callback(cbdata, connectedPeer);

      removePeerListener(listener);
    },
  );

  responseCode++;
};

const handleData = (data: DataPackage, peerConnection: ConnectedPeer) => {
  // console.log("Data type: ", data.type);

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
