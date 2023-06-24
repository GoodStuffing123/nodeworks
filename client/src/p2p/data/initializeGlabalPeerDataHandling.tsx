import { addPeerListener } from "./peerDataHandler";
import { findFreeIndex } from "../indexing";
import { generatePublicUserData, self } from "./user";
import registerOtherUser from "./user/registerOtherUser";
import recieveConnectedUser from "./user/recieveConnectedUser";
import syncUserDatabase from "../database/syncUserDatabase";

import { dataTypes } from "./types";

const initializeGlobalPeerDataHandling = () => {
  addPeerListener(dataTypes.TEST, (data) => {
    console.log("TEST MESSAGE RECIEVED: ", data.payload);
  });

  addPeerListener(dataTypes.PING, () => {
    return true;
  });

  addPeerListener(dataTypes.FIND_FREE_INDEX, findFreeIndex);

  addPeerListener(dataTypes.REGISTER_USER, registerOtherUser);
  addPeerListener(dataTypes.SEND_SELF, recieveConnectedUser);
  addPeerListener(dataTypes.REQUEST_SELF, () =>
    self.user ? generatePublicUserData(self.user) : null,
  );
  addPeerListener(dataTypes.SYNC_USER_DATABASE, syncUserDatabase);
};

export default initializeGlobalPeerDataHandling;
