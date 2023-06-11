import { connectedPeers, handleDisconnect } from "../webConnect";
import { sendWithResponse } from "./peerDataHandler";

import { dataTypes } from "./types";

let pingInterval: NodeJS.Timer;

const initializePinging = () => {
  clearInterval(pingInterval);

  pingInterval = setInterval(() => {
    const now = Date.now();
    connectedPeers.forEach((connectedPeer) => {
      if (!connectedPeer.lastPing || now - connectedPeer.lastPing < 15000) {
        // console.log("PING");

        sendWithResponse(
          {
            type: dataTypes.PING,
          },
          connectedPeer,
          (res) => {
            if (res.payload) {
              // console.log("PONG BACK");

              connectedPeer.lastPing = Date.now();
            }
          },
        );
      } else {
        handleDisconnect(connectedPeer);
      }
    });
  }, 10000);
};

initializePinging();
