import { self } from "../data/user";
import { connectedPeers } from "../connection";
import {
  setConnectedPeers,
  setSelf as setReactSelf,
} from "../../reactCode/Connect";

import { PrivateUserData, UserDocument } from "./types";
import { Vector2 } from "../indexing/types";
import { ConnectedPeer } from "../connection/types";
import { matchIndexes } from "../indexing";

const data: {
  users: {
    [x: number]: {
      [y: number]: UserDocument;
    };
  };

  self: PrivateUserData;
} = {
  users: {},
  self: null,
};

export const getData = (path: (string | number)[]) => {
  let dataToGet: any = data;

  for (let i = 0; i < path.length; i++) {
    if (dataToGet) {
      dataToGet = dataToGet[path[i]];
    } else {
      break;
    }
  }

  return dataToGet;
};

export const setData = (path: (string | number)[], value: any) => {
  let dataToChange: any = data;
  for (let i = 0; i < path.length; i++) {
    const pathPos = path[i];

    if (i === path.length - 1) {
      dataToChange[pathPos] = value;
    } else {
      if (!dataToChange[pathPos]) {
        dataToChange[pathPos] = {};
      }

      dataToChange = dataToChange[pathPos];
    }
  }

  if (path[0] === "self") {
    setReactSelf(self);
  }
};

export const getUser = (index: Vector2): UserDocument => {
  let user: UserDocument = getData(["users", ...index]);

  if (user) {
    return user;
  } else if (self.user?.index && matchIndexes(index, self.user.index)) {
    const newUserDocument: UserDocument = {
      username: self.user.username,
      publicKey: self.user.publicKey,
      index: self.user.index,

      discoveredAt: null,
      lastConnection: null,
    };

    return newUserDocument;
  } else {
    return null;
  }
};

export const setUser = (
  userData: UserDocument,
  connectedPeer?: ConnectedPeer,
) => {
  setData(["users", userData.index[0], userData.index[1]], userData);

  if (connectedPeer) {
    connectedPeer.user = userData;
    setConnectedPeers(connectedPeers);
  }
};

export const getAllUsers = () => {
  const userDb: { [x: number]: { [y: number]: UserDocument } } = getData([
    "users",
  ]);

  const userList: UserDocument[] = [];
  Object.values(userDb).forEach((column) => {
    Object.values(column).forEach((user) => {
      if (user) {
        userList.push(user);
      }
    });
  });

  return userList;
};
