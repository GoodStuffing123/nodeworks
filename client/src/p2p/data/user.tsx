import { getAllUsers, getData, getUser, setData, setUser } from "../database";
import { broadcast, sendWithResponse, send } from "./peerDataHandler";
import { exportCryptoKeyPair, generateKeys } from "../security/encryption";
import { connectedPeers, connectToPeer } from "../connection/webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";

import { Self, UserDocument } from "../database/types";
import { ConnectedPeer } from "../connection/types";
import { DataPackage, dataTypes } from "./types";

let username: string;
export const setUsername = (newUsername: string) => (username = newUsername);

export const createUser = async (
  name: string,
  connectedPeer: ConnectedPeer,
) => {
  await new Promise((resolve) =>
    sendWithResponse(
      {
        type: dataTypes.FIND_FREE_INDEX,
      },
      connectedPeer,
      async (data) => {
        const encryptionKeys = await exportCryptoKeyPair(generateKeys(true));

        const self: Self = {
          name,
          index: data.payload,
          ...encryptionKeys,
          createdAt: new Date(),
        };

        const publicSelf: UserDocument = {
          name: self.name,
          index: self.index,
          publicKey: self.publicKey,

          discoveredAt: null,
          lastConnection: null,
        };

        sendWithResponse(
          {
            type: dataTypes.REGISTER_USER,
            payload: publicSelf,
            chainHistory: [self.index],
          },
          connectedPeer,
          ({ payload: error }) => {
            if (error) {
              console.error(error);

              resolve(false);
            } else {
              setData(["self"], self);

              resolve(true);
            }
          },
        );
      },
    ),
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

  if (getData(["self"])) {
    const syncPayload = {
      users: getAllUsers(),
      peerIds: connectedPeers.map((peer) => peer.connection.peer),
    };

    broadcast(
      {
        type: dataTypes.SYNC_USER_DATABASE,
        payload: syncPayload,
      },
      [...connectedPeers].splice(
        connectedPeers.findIndex(
          (otherConnectedPeer) =>
            connectedPeer.connection.peer ===
            otherConnectedPeer.connection.peer,
        ),
      ),
    );

    send(
      {
        type: dataTypes.SYNC_USER_DATABASE,
        payload: syncPayload,
      },
      connectedPeer,
    );
  } else {
    createUser(username, connectedPeer);
  }
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
  console.log("RECIEVED USER DATA FROM CONNECTED PEER", data.payload);

  if (data.payload) {
    let foundUser = getUser(data.payload.index);
    if (foundUser) {
      connectedPeer.user = foundUser;
    } else {
      connectedPeer.user = generateUser(data.payload);
      setUser(connectedPeer.user, connectedPeer);
    }

    setConnectedPeers(connectedPeers);

    return getData(["self"]);
  }
};

export const syncUserDatabase = (data: DataPackage) => {
  data.payload.users.forEach((user: UserDocument) => {
    if (!getUser(user.index)) {
      setUser(user);
    }
  });

  console.log("Syncing User DB");

  data.payload.peerIds.forEach((peerId: string) => {
    connectToPeer(peerId);
  });
};
