import Peer from "peerjs";
import { self, setSelf, setUsername } from "../data/user";
import connectToNetwork from "./connectToNetwork";
import { getData } from "../database";
import { handleSelfPeerError } from "../errorHandling";
import destroy from "./destroy";
import { deinitializePinging } from "../data/pingHandler";

import { ConnectedPeer } from "./types";

// Declare global variables
export let connectedPeers: ConnectedPeer[] = [];

// Connects user to peers
export const connect = (name: string, peerId?: string) => {
  deinitializePinging();

  setUsername(name);

  if (self.peer) {
    destroy();
  }

  // Create connectible local peer
  setSelf({
    peer: new Peer(peerId || null),
    user: getData(["self"]),
  });

  // Handle errors
  self.peer.on("error", handleSelfPeerError);

  // Wait for initialization
  self.peer.on("open", connectToNetwork);
};
