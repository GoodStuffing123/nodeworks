import { connectedPeers } from "../connection/webConnect";
import { sendWithResponse } from "./peerDataHandler";
import handleDisconnect from "../connection/handleDisconnect";

import { dataTypes } from "./types";

let pingInterval: NodeJS.Timer;

const initializePinging = () => {
  clearInterval(pingInterval);

  pingInterval = setInterval(() => {
    const now = Date.now();

    connectedPeers.forEach((connectedPeer) => {
      if (!connectedPeer.lastPing || now - connectedPeer.lastPing < 25000) {
        // console.log("PING");
        if (!connectedPeer.lastPing) {
          connectedPeer.lastPing = Date.now() - 10000;
        }

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
