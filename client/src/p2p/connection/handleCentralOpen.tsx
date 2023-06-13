import { connectedPeers } from "./webConnect";
import { createUser } from "../data/user";
import { setConnectedPeers } from "../../reactCode/Connect";
import { getData } from "../database";
import handleData from "../data/peerDataHandler";
import handleDisconnect from "./handleDisconnect";

import { ConnectedPeer } from "./types";
import { DataPackage } from "../data/types";

const handleCentralPeerOpen = (name: string, centralPeer: ConnectedPeer) => {
  console.log("CONNECTED TO CENTRAL PEER");

  connectedPeers.push(centralPeer);
  setConnectedPeers(connectedPeers);

  centralPeer.connection.on("error", console.error);

  centralPeer.connection.on("data", (data: DataPackage) =>
    handleData(data, centralPeer),
  );

  if (!getData(["self"])) {
    createUser(name, centralPeer);
  }

  centralPeer.connection.on("close", () => handleDisconnect(centralPeer));
};

export default handleCentralPeerOpen;
