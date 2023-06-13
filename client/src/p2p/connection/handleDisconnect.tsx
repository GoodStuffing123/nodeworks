import { connectedPeers } from "./webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";

import { ConnectedPeer } from "./types";

const handleDisconnect = (connectedPeer: ConnectedPeer) => {
  console.error("DISCONNECTING");

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
