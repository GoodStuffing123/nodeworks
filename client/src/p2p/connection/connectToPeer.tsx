import { self } from "../data/user";
import { findConnectedPeerOrSelfById } from "./findConnectedPeers";
import handleConnection from "./handleConnection";

export let connectingToPeer = false;
const connectToPeer = async (peerId: string) => {
  if (!findConnectedPeerOrSelfById(peerId)) {
    const peerConnection = self.peer.connect(peerId);

    return await handleConnection(peerConnection, true);
  }
};

export default connectToPeer;
