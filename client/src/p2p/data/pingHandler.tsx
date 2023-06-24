import { self } from "./user";
import { connectedPeers } from "../connection";
import { sendWithResponse } from "./peerDataHandler";
import handleDisconnect from "../connection/disconnectFromPeer";
import { distanceBetweenIndexes } from "../indexing";
import recieveConnectedUser from "./user/recieveConnectedUser";

import { dataTypes, PublicUserData } from "./types";

let pingInterval: NodeJS.Timer;
const pingIntervalDelay = 10000;
const minPeerConnectionsLimit = 5;

export const initializePinging = () => {
  deinitializePinging();

  pingInterval = setInterval(() => {
    const now = Date.now();

    connectedPeers.forEach(async (connectedPeer) => {
      if (
        self.user &&
        connectedPeer.user &&
        connectedPeers.length > minPeerConnectionsLimit &&
        distanceBetweenIndexes(connectedPeer.user.index, self.user.index) >= 2
      ) {
        handleDisconnect(connectedPeer);
      } else {
        if (
          !connectedPeer.lastPing ||
          now - connectedPeer.lastPing < pingIntervalDelay * 2 + 5000
        ) {
          if (!connectedPeer.lastPing) {
            connectedPeer.lastPing = Date.now() - pingIntervalDelay;
          }

          const pingResponse = await sendWithResponse<boolean>(
            {
              type: dataTypes.PING,
            },
            connectedPeer,
          );

          if (pingResponse.payload) {
            if (connectedPeer.user) {
              connectedPeer.lastPing = Date.now();
            } else {
              const otherUserData = await sendWithResponse<PublicUserData>(
                { type: dataTypes.REQUEST_SELF },
                connectedPeer,
              );

              recieveConnectedUser(otherUserData, connectedPeer);
            }
          }
        } else {
          handleDisconnect(connectedPeer);
        }
      }
    });
  }, pingIntervalDelay);
};

export const deinitializePinging = () => {
  clearInterval(pingInterval);

  connectedPeers.forEach((connectedPeer) => {
    connectedPeer.lastPing = null;
  });
};
