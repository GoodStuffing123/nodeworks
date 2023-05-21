// import axios from "axios";
import Peer, { DataConnection } from "peerjs";
import { setPeerConnections } from "../reactCode/Connect";
import handleData from "./data/peerDataHandler";
import { DataPackage } from "./data/types";

// Declare types

export interface ConnectedPeer {
  id: string;
  lastPing: number;
}

// Declare global variables

// const centralServer = "https://decentralized-server.uc.r.appspot.com";
// const centralServer = "http://localhost:9000";

export let peer: Peer = null;
export let peerConnections: DataConnection[] = [];

// Connects user to peers
export const connect = (peerName?: string) => {
  // Create connectible local peer
  peer = new Peer(peerName || null);

  // Wait for initialization
  peer.on("open", async (id) => {
    console.log("My ID: " + peer.id);

    if (peerName !== process.env.REACT_APP_CENTRAL_PEER_NAME) {
      const initialPeerConnection = peer.connect(
        process.env.REACT_APP_CENTRAL_PEER_NAME,
      );

      initialPeerConnection.on("open", () => {
        console.log("CONNECTED TO CENTRAL PEER");

        peerConnections.push(initialPeerConnection);
        setPeerConnections(peerConnections);

        initialPeerConnection.on("close", () => {
          console.log("DISCONNECTED FROM CENTRAL PEER");

          peerConnections.splice(
            peerConnections.indexOf(initialPeerConnection),
            1,
          );
          setPeerConnections(peerConnections);
        });
      });
    }

    // Request peer addresses from central server
    // const res = await axios.get(`${centralServer}/addresses?peerId=${id}`);

    // Keep user available to central server
    // let pingInterval = setInterval(() => {
    //   axios.get(`${centralServer}/ping?peerId=${id}`).catch((err) => {
    //     console.error(err);
    //     clearInterval(pingInterval);
    //   });
    // }, 1000 * 50);

    // // Iterate through recieved addresses
    // const otherAddresses: PeerAddress[] = res.data;
    // otherAddresses.forEach((address) => {
    //   // Connect to peer
    //   const peerConnection = peer.connect(address.id);

    //   // Wait for connection to be established
    //   peerConnection.on("open", () => {

    //     // Listen for data sent from peer
    //     peerConnection.on("data", (data: DataPackage) => {
    //       handleData(data, peerConnection);
    //     });

    //     // Add new connection to list of peer connections
    //     peerConnections.push(peerConnection);
    //     // Update React state with new peer
    //     setPeerConnections(peerConnections);
    //   });

    //   peerConnection.on("close", () => {
    //     peerConnections.splice(peerConnections.indexOf(peerConnection), 1);
    //   });
    // });

    // Listen for incoming connections from unconnected peers
    peer.on("connection", (peerConnection) => {
      peerConnection.on("data", (data: DataPackage) => {
        handleData(data, peerConnection);
      });

      peerConnection.on("close", () => {
        peerConnections.splice(peerConnections.indexOf(peerConnection), 1);
        setPeerConnections(peerConnections);
      });

      console.log("CONNECTED TO " + peerConnection.peer);

      // Add new connection to list of peer connections
      peerConnections.push(peerConnection);
      // Update React state with new peer
      setPeerConnections(peerConnections);
    });
  });
};

// Disconnects user from peers
export const disconnect = () => {
  // Disconnect from connection server
  peer.destroy();

  // Reset variables
  peer = null;
  peerConnections = [];
  // Update react state
  setPeerConnections(peerConnections);
};
