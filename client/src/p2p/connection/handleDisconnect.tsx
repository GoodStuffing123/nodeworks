import { connectedPeers, peer } from "./webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";

import { ConnectedPeer } from "./types";

const handleDisconnect = (connectedPeer: ConnectedPeer) => {
  console.error("DISCONNECTING");

  const gottenConnection = peer.getConnection(
    connectedPeer.connection.peer,
    connectedPeer.connection.connectionId,
  );

  if (gottenConnection) {
    gottenConnection.removeAllListeners();

    gottenConnection.close();
  }

  connectedPeers.splice(
    connectedPeers.findIndex(
      (otherConnectedPeer) =>
        connectedPeer.connection.peer === otherConnectedPeer.connection.peer,
    ),
    1,
  );

  setConnectedPeers(connectedPeers);
};

export default handleDisconnect;
