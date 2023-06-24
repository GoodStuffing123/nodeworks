import { self, username, createUser } from "./index";
import { getUser, setUser, getAllUsers } from "../../database";
import generateUserDocument from "../../database/generateUserDocument";
import { connectedPeers } from "../../connection";
import { broadcast } from "../peerDataHandler";

import { ConnectedPeer } from "../../connection/types";
import { UserDocument } from "../../database/types";
import { DataPackage, dataTypes } from "../types";

const registerOtherUser = (
  data: DataPackage<UserDocument>,
  connectedPeer: ConnectedPeer,
) => {
  if (
    !data.payload.index ||
    data.payload.index[0] == null ||
    data.payload.index[1] == null
  )
    return `The index, ${data.payload.index}, is invalid!`;

  if (getUser(data.payload.index))
    return `The space, ${data.payload.index} is already taken!`;

  setUser(generateUserDocument(data.payload), connectedPeer);

  if (self.user) {
    const syncPayload = {
      users: getAllUsers(),
      peerIds: connectedPeers.map((peer) => peer.connection.peer),
    };

    broadcast(
      {
        type: dataTypes.SYNC_USER_DATABASE,
        payload: syncPayload,
      },
      connectedPeers,
    );
  } else {
    createUser(connectedPeer);
  }
};

export default registerOtherUser;
