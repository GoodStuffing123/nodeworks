import { connectedPeers, peer } from "./webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";
import handleDisconnect from "./handleDisconnect";
import handleOpen from "./handleOpen";

import { DataConnection } from "peerjs";
import { ConnectedPeer } from "./types";

const handleConnection = async (
  peerConnection: DataConnection,
  initiator = false,
  name?: string,
) => {
  await new Promise((resolve) => {
    let connectedPeer: ConnectedPeer = {
      connection: peerConnection,
      user: null,
    };

    const peerErrorHandler = () => {
      peer.removeListener("error", peerErrorHandler);

      resolve(false);
    };

    peer.addListener("error", peerErrorHandler);

    connectedPeer.connection.on("error", (error) => {
      console.error(error);

      handleDisconnect(connectedPeer);

      resolve(false);
    });

    connectedPeer.connection.on("open", async () => {
      // // Update React state with new peer
      // setConnectedPeers(connectedPeers);

      peer.removeListener("error", peerErrorHandler);

      // Add new connection to list of peer connections
      connectedPeers.push(connectedPeer);

      await handleOpen(connectedPeer, initiator, name || null);

      resolve(true);
    });

    connectedPeer.connection.on("close", () => {
      handleDisconnect(connectedPeer);

      resolve(false);
    });
  });
};

export default handleConnection;
