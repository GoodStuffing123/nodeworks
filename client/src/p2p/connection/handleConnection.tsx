import { self } from "../data/user";
import handleOpen from "./handleOpen";
import disconnectFromPeer from "./disconnectFromPeer";

import { DataConnection } from "peerjs";
import { ConnectedPeer } from "./types";

export let connectingToPeer = false;

const handleConnection = (
  peerConnection: DataConnection,
  initiator = false,
) => {
  if (!connectingToPeer) {
    connectingToPeer = true;

    return new Promise<boolean>((promiseResolve) => {
      let resolved = false;
      const resolve = (value: boolean | PromiseLike<boolean>) => {
        if (!resolved) {
          promiseResolve(value);
          resolved = true;
          connectingToPeer = false;
        }
      };

      const connectedPeer: ConnectedPeer = {
        connection: peerConnection,
        user: null,
      };

      peerConnection.on("error", () => {
        disconnectFromPeer(connectedPeer);

        resolve(false);
      });
      peerConnection.on("close", () => {
        disconnectFromPeer(connectedPeer);

        resolve(false);
      });

      const peerErrorHandler = () => {
        self.peer.removeListener("error", peerErrorHandler);

        resolve(false);
      };

      self.peer.addListener("error", peerErrorHandler);

      peerConnection.on("open", () => {
        self.peer.removeListener("error", peerErrorHandler);

        handleOpen(connectedPeer, initiator, resolve);
      });
    });
  } else {
    peerConnection.on("open", () => {
      peerConnection.close();
    });
  }
};

// const handleConnection = (
//   peerConnection: DataConnection,
//   initiator = false,
//   name?: string,
// ) => {
//   // Return promise that waits for full connection to be established
//   return new Promise<boolean>((resolve) => {
//     // Declare a new connected peer
//     let connectedPeer: ConnectedPeer = {
//       connection: peerConnection,
//       user: null,
//     };

//     // Resolve early if error is thrown so process can continue
//     const peerErrorHandler = () => {
//       self.peer.removeListener("error", peerErrorHandler);

//       resolve(false);
//     };

//     // Apply handler to own peer error listener
//     self.peer.addListener("error", peerErrorHandler);

//     // Disconnect and resolve early if the connected peer throws an error
//     connectedPeer.connection.on("error", (error) => {
//       console.error(error);

//       handleDisconnect(connectedPeer);

//       resolve(false);
//     });

//     // This happens if the peer exists and responds to the connection request
//     connectedPeer.connection.on("open", async () => {
//       self.peer.removeListener("error", peerErrorHandler);

//       if (!findConnectedPeerOrSelfById(connectedPeer.connection.peer)) {
//         // Add new connection to list of peer connections
//         connectedPeers.push(connectedPeer);

//         const resolveValue = await handleOpen(
//           connectedPeer,
//           initiator,
//           name || null,
//         );

//         resolve(resolveValue);
//       } else {
//         handleDisconnect(connectedPeer);

//         resolve(false);
//       }
//     });

//     connectedPeer.connection.on("close", () => {
//       handleDisconnect(connectedPeer);

//       resolve(false);
//     });
//   });
// };

export default handleConnection;
