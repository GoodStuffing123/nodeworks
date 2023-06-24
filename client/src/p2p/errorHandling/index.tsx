import disconnectFromPeer from "../connection/disconnectFromPeer";

import { ConnectedPeer } from "../connection/types";

export const handleGenericError = (error: Error) => {
  console.error(error);
};

export const handleConnectionError = (
  error: Error,
  connectedPeer: ConnectedPeer,
) => {
  disconnectFromPeer(connectedPeer);
};

export const handleSelfPeerError = (error: Error) => {
  // @ts-ignore
  if (error.type === "peer-unavailable") {
    console.log("Peer unavailable");
  } else {
    console.error(error);
  }
};
