// import axios from "axios";
import Peer from "peerjs";
import { setConnectedPeers } from "../../reactCode/Connect";
import initializeGlobalPeerDataHandling from "../data/initializeGlabalPeerDataHandling";
import { setData } from "../database";
import handleConnection from "./handleConnection";
import handleCentralPeerOpen from "./handleCentralOpen";
import { exportCryptoKeyPair, generateKeys } from "../security/encryption";
import "../data/pingHandler";

import { ConnectedPeer } from "./types";
import { Self } from "../database/types";

// Declare global variables

// const centralServer = "https://decentralized-server.uc.r.appspot.com";
// const centralServer = "http://localhost:9000";

export let peer: Peer = null;
export let connectedPeers: ConnectedPeer[] = [];

// Connects user to peers
export const connect = (name: string, peerId?: string) => {
  // Create connectible local peer
  peer = new Peer(peerId || null);

  peer.on("error", console.error);

  // Wait for initialization
  peer.on("open", async () => {
    console.log("My ID: " + peer.id);

    // Set up base data listeners
    initializeGlobalPeerDataHandling();

    // Connect to central peer if this is not the central peer
    if (peerId !== process.env.REACT_APP_CENTRAL_PEER_NAME) {
      const initialPeerConnection: ConnectedPeer = {
        connection: peer.connect(process.env.REACT_APP_CENTRAL_PEER_NAME),
        user: null,
      };

      initialPeerConnection.connection.on("open", () =>
        handleCentralPeerOpen(name, initialPeerConnection),
      );
    } else {
      const encryptionKeys = await exportCryptoKeyPair(generateKeys());
      const newSelf: Self = {
        name,
        index: [0, 0],
        ...encryptionKeys,
        createdAt: new Date(),
      };

      setData(["self"], newSelf);
    }

    // Listen for incoming connections from unconnected peers
    peer.on("connection", (peerConnection) => handleConnection(peerConnection));

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
    //     connectedPeers.push(peerConnection);
    //     // Update React state with new peer
    //     setPeerConnections(connectedPeers);
    //   });

    //   peerConnection.on("close", () => {
    //     connectedPeers.splice(connectedPeers.indexOf(peerConnection), 1);
    //   });
    // });
  });
};

// Disconnects user from peers
export const disconnect = () => {
  // Disconnect from connection server
  peer.destroy();

  // Reset variables
  peer = null;
  connectedPeers = [];
  // Update react state
  setConnectedPeers(connectedPeers);
};

export const connectToPeer = (peerId: string) => {
  if (
    !connectedPeers.find(
      (connectedPeer) =>
        connectedPeer.connection.peer === peerId || peer.id === peerId,
    )
  ) {
    const peerConnection = peer.connect(peerId);

    handleConnection(peerConnection);
  }
};
