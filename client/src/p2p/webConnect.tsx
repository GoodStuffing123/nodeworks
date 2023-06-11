// import axios from "axios";
import Peer from "peerjs";
import { setConnectedPeers } from "../reactCode/Connect";
import handleData, { send } from "./data/peerDataHandler";
import initializeGlobalPeerDataHandling from "./data/initializeGlabalPeerDataHandling";
import { getData, setData } from "./database";
import "./data/pingHandler";

import { ConnectedPeer } from "./types";
import { DataPackage, dataTypes } from "./data/types";
import { createUser, generateUser } from "./data/user";
import { Self } from "./database/types";
import { exportCryptoKeyPair, generateKeys } from "./security/encryption";

// Declare global variables

// const centralServer = "https://decentralized-server.uc.r.appspot.com";
// const centralServer = "http://localhost:9000";

export let peer: Peer = null;
export let connectedPeers: ConnectedPeer[] = [];

// Connects user to peers
export const connect = (peerName?: string) => {
  // Create connectible local peer
  peer = new Peer(peerName || null);

  // Wait for initialization
  peer.on("open", async () => {
    console.log("My ID: " + peer.id);

    // Set up base data listeners
    initializeGlobalPeerDataHandling();

    // Connect to central peer if this is not the central peer
    if (peerName !== process.env.REACT_APP_CENTRAL_PEER_NAME) {
      const initialPeerConnection: ConnectedPeer = {
        connection: peer.connect(process.env.REACT_APP_CENTRAL_PEER_NAME),
        user: null,
      };

      initialPeerConnection.connection.on("open", async () => {
        console.log("CONNECTED TO CENTRAL PEER");

        connectedPeers.push(initialPeerConnection);
        setConnectedPeers(connectedPeers);

        initialPeerConnection.connection.on("error", (error) =>
          console.error(error),
        );

        initialPeerConnection.connection.on("data", (data: DataPackage) => {
          handleData(data, initialPeerConnection);
        });

        if (!getData(["self"])) {
          createUser(initialPeerConnection);
        }

        initialPeerConnection.connection.on("close", () =>
          handleDisconnect(initialPeerConnection),
        );

        initialPeerConnection.connection.on("error", () => {
          console.error("ERROR THROWN FROM CENTRAL PEER");
        });
      });
    } else {
      const encryptionKeys = await exportCryptoKeyPair(generateKeys());
      setData(
        ["self"],
        generateUser({
          index: [0, 0],
          ...encryptionKeys,
        }),
      );
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
    //     connectedPeers.push(peerConnection);
    //     // Update React state with new peer
    //     setPeerConnections(connectedPeers);
    //   });

    //   peerConnection.on("close", () => {
    //     connectedPeers.splice(connectedPeers.indexOf(peerConnection), 1);
    //   });
    // });

    // Listen for incoming connections from unconnected peers
    peer.on("connection", (peerConnection) => {
      const connectedPeer: ConnectedPeer = {
        connection: peerConnection,
        user: null,
      };

      connectedPeer.connection.on("error", (error) => console.error(error));

      connectedPeer.connection.on("data", (data: DataPackage) => {
        handleData(data, connectedPeer);
      });

      connectedPeer.connection.on("open", () => {
        console.log("CONNECTED TO " + connectedPeer.connection.peer);

        // Add new connection to list of peer connections
        connectedPeers.push(connectedPeer);
        // Update React state with new peer
        setConnectedPeers(connectedPeers);

        const self: Self = getData(["self"]);
        if (self) {
          const publicSelf = {
            index: self.index,
            publicKey: self.publicKey,
          };

          send(
            {
              type: dataTypes.SEND_USER,
              payload: publicSelf,
            },
            connectedPeer,
          );
        } else {
          console.error("I don't have a user!");
        }
      });

      connectedPeer.connection.on("close", () =>
        handleDisconnect(connectedPeer),
      );
    });
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

export const handleDisconnect = (connectedPeer: ConnectedPeer) => {
  connectedPeers.splice(connectedPeers.indexOf(connectedPeer), 1);
  setConnectedPeers(connectedPeers);
};
