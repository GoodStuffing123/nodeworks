import { connectedPeers } from "./index";
import { self } from "../data/user";
import { setConnectedPeers } from "../../reactCode/Connect";

import { ConnectedPeer } from "./types";

const disconnectFromPeer = (connectedPeer: ConnectedPeer) => {
  console.error("DISCONNECTING");

  const gottenConnection = self.peer.getConnection(
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
        connectedPeer.connection.peer == otherConnectedPeer.connection.peer,
    ),
    1,
  );

  setConnectedPeers(connectedPeers);
};

export default disconnectFromPeer;
