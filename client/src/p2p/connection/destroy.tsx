import { connectedPeers } from "./index";
import { self, setSelf } from "../data/user";
import { setConnectedPeers } from "reactCode/Connect";

const destroy = () => {
  // Disconnect from connection server
  self.peer.removeAllListeners();
  self.peer.destroy();

  // Reset variables
  setSelf({
    peer: null,
    user: null,
  });
  connectedPeers.splice(0, connectedPeers.length);

  // Update react state
  setConnectedPeers(connectedPeers);
};

export default destroy;
