import { addPeerListener } from "./peerDataHandler";
import { findFreeIndex } from "../indexing";
import {
  recieveConnectedUser,
  registerOtherUser,
  syncUserDatabase,
} from "./user";
import { dataTypes } from "./types";

const initializeGlobalPeerDataHandling = () => {
  addPeerListener(dataTypes.TEST, (data) => {
    console.log("TEST MESSAGE RECIEVED: ", data.payload);
  });

  addPeerListener(dataTypes.PING, () => {
    // console.log("PONG");

    return true;
  });

  addPeerListener(dataTypes.FIND_FREE_INDEX, findFreeIndex);

  addPeerListener(dataTypes.REGISTER_USER, registerOtherUser);
  addPeerListener(dataTypes.SEND_USER, recieveConnectedUser);
  addPeerListener(dataTypes.SYNC_USER_DATABASE, syncUserDatabase);
};

export default initializeGlobalPeerDataHandling;
