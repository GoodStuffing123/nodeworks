import { connectedPeers } from "./webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";
import handleDisconnect from "./handleDisconnect";
import handleOpen from "./handleOpen";

import { DataConnection } from "peerjs";
import { ConnectedPeer } from "./types";

const handleConnection = (peerConnection: DataConnection) => {
  let connectedPeer: ConnectedPeer = {
    connection: peerConnection,
    user: null,
  };

  // Add new connection to list of peer connections
  connectedPeers.push(connectedPeer);

  // Update React state with new peer
  setConnectedPeers(connectedPeers);

  connectedPeer.connection.on("error", (error) => console.error(error));

  connectedPeer.connection.on("open", () => handleOpen(connectedPeer));

  connectedPeer.connection.on("close", () => handleDisconnect(connectedPeer));
};

export default handleConnection;
