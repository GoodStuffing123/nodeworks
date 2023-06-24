import { connectedPeers } from "./index";
import { self } from "../data/user";
import { iterateRandomlyWithinRange } from "../../lib/iterators";

import { ConnectedPeer } from "./types";

export const findConnectedPeerOrSelfById = (peerId: string) => {
  return connectedPeers.find(
    (connectedPeer) =>
      connectedPeer.connection.peer === peerId || self.peer.id === peerId,
  );
};

export const findRandomConnectedPeerWithIndex = (exclude: string[] = []) => {
  let connectedPeer: ConnectedPeer;

  iterateRandomlyWithinRange(0, connectedPeers.length, (i, cancel) => {
    connectedPeer = connectedPeers[i];
    if (
      connectedPeer.user?.index &&
      !exclude.find((peerId) => connectedPeer.connection.peer === peerId)
    ) {
      cancel();
    } else {
      connectedPeer = null;
    }
  });

  return connectedPeer;
};
