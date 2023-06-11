import { getAllUsers, getData, getUser, setData, setUser } from "../database";
import { broadcast, sendWithResponse } from "./peerDataHandler";
import { exportCryptoKeyPair, generateKeys } from "../security/encryption";
import { connectedPeers, peer } from "../webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";

import { Self, UserDocument } from "../database/types";
import { ConnectedPeer } from "../types";
import { DataPackage, dataTypes } from "./types";

export const createUser = (centralPeer: ConnectedPeer) => {
  sendWithResponse(
    {
      type: dataTypes.FIND_FREE_INDEX,
    },
    centralPeer,
    async (data) => {
      const encryptionKeys = await exportCryptoKeyPair(generateKeys(true));

      const self: Self = {
        index: data.payload,
        ...encryptionKeys,
        createdAt: new Date(),
      };

      sendWithResponse(
        {
          type: dataTypes.REGISTER_USER,
          payload: {
            index: self.index,
            publicKey: self.publicKey,
          },
          chainHistory: [self.index],
        },
        centralPeer,
        ({ payload: error }) => {
          if (error) {
            console.error(error);
          } else {
            setData(["self"], self);

            console.log("User has been registered!");
          }
        },
      );
    },
  );
};

export const registerOtherUser = async (
  data: DataPackage,
  connectedPeer: ConnectedPeer,
) => {
  if (
    data.payload.index === undefined ||
    !data.payload.index[0] === undefined ||
    !data.payload.index[1] === undefined
  )
    return `The index, ${data.payload.index}, is invalid!`;

  if (getData(data.payload.index))
    return `Space ${data.payload.index} already taken!`;

  setUser(generateUser(data.payload), connectedPeer);

  broadcast({
    type: dataTypes.SYNC_USER_DATABASE,
    payload: {
      users: getAllUsers(),
      peerIds: connectedPeers.map((peer) => peer.connection.peer),
    },
  });
};

export const generateUser = (userData: any): UserDocument => ({
  ...userData,
  lastConnection: new Date(),
  discoveredAt: new Date(),
});

export const recieveConnectedUser = (
  data: DataPackage,
  connectedPeer: ConnectedPeer,
) => {
  let foundUser = getUser(data.payload.index);
  if (foundUser) {
    connectedPeer.user = foundUser;
  } else {
    connectedPeer.user = generateUser(data.payload);
    setUser(connectedPeer.user, connectedPeer);
  }

  setConnectedPeers(connectedPeers);
};

export const syncUserDatabase = (
  data: DataPackage,
  connectedPeer: ConnectedPeer,
) => {
  console.log("Syncing user database!");

  data.payload.users.forEach((user: UserDocument) => {
    if (!getUser(user.index)) {
      setUser(user);
    }
  });

  data.payload.peerIds.forEach((peerId: string) => {
    if (
      !connectedPeers.find(
        (connectedPeer) =>
          connectedPeer.connection.peer === peerId || peer.id === peerId,
      )
    ) {
      peer.connect(peerId);
    }
  });
};
