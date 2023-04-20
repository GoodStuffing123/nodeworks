import axios from "axios";
import Peer, { DataConnection } from "peerjs";
import handleData, { DataPackage, removePeerListener } from "./peerDataHandler";

// Declare types
interface PeerAddress {
  id: string,
  lastPing: number,
}

// const centralServer = "https://decentralized-server.uc.r.appspot.com";
const centralServer = "http://localhost:9000";

// Declare global variables
export let peer: Peer = null;
export let peerConnections: DataConnection[] = [];

// Connects user to peers
export const connect = (setPeerConnections: Function) => {
  // Create connectible local peer
  peer = new Peer();
  peer.on("open", async (id) => {
    // Request peer addresses from central server
    const res = await axios.get(`${centralServer}/addresses?peerId=${id}`);

    // Keep user available to central server
    let pingInterval = setInterval(() => {
      axios.get(`${centralServer}/ping?peerId=${id}`)
        .catch((err) => {
          console.error(err);
          clearInterval(pingInterval);
        });
    }, 1000 * 50);

    // Iterate through recieved addresses
    const otherAddresses: PeerAddress[] = res.data;
    otherAddresses.forEach((address) => {
      // Connect to peer
      const peerConnection = peer.connect(address.id);

      peerConnection.on("open", () => {
        // Listen for data sent from peer
        peerConnection.on("data", (data: DataPackage) => {
          handleData(data, peerConnection);
        });

        // Add new connection to list of peer connections
        peerConnections.push(peerConnection);
        // Update React state with new peer
        setPeerConnections(peerConnections);
      });

      peerConnection.on("close", () => {
        peerConnections.splice(peerConnections.indexOf(peerConnection), 1);
      });
    });

    // Listen for incoming connections from unconnected peers
    peer.on("connection", (peerConnection) => {
      // Listen for data sent from peer
      peerConnection.on("data", (data: DataPackage) => {
        handleData(data, peerConnection);
      });

      // Add new connection to list of peer connections
      peerConnections.push(peerConnection);
      // Update React state with new peer
      setPeerConnections(peerConnections);
    });
  });
}

// Disconnects user from peers
export const disconnect = (setPeerConnections: Function) => {
  // Disconnect from connection server
  peer.destroy();

  // // Close connection to all connected peers
  // peerConnections.forEach((peerConnection) => {
  //   peerConnection.close();
  // });

  // Reset variables
  peer = null;
  peerConnections = [];
  // Update react state
  setPeerConnections(peerConnections);
}
