import axios from "axios";
import { self } from "../data/user";
import initializeGlobalPeerDataHandling from "../data/initializeGlabalPeerDataHandling";
import handleConnection from "./handleConnection";
import connectToPeer from "./connectToPeer";
import { initializePinging } from "../data/pingHandler";

const centralServer =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9000"
    : "https://nodeworks.cyclic.app";

const connectToNetwork = async () => {
  console.log("Requesting API data from", centralServer);

  // Request peer addresses from central server
  const addresses: string[] = (
    await axios.get(`${centralServer}/?peerId=${self.peer.id}`)
  ).data;

  // Set up base data listeners
  initializeGlobalPeerDataHandling();

  // Iterate and attempt connection to recieved peer ids one by one
  for (let i = 0; i < addresses.length; i++) {
    const connectionResponse = await connectToPeer(addresses[i]);

    if (connectionResponse) break;
  }

  // Listen for incoming connections from unconnected peers
  self.peer.on("connection", handleConnection);

  initializePinging();
};

export default connectToNetwork;
