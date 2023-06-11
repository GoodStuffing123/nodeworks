import { connectedPeers } from "../webConnect";
import { setConnectedPeers } from "../../reactCode/Connect";

import { Self, UserDocument } from "./types";
import { Vector2 } from "../indexing/types";
import { ConnectedPeer } from "../types";

const data: {
  users: {
    [x: number]: {
      [y: number]: UserDocument;
    };
  };

  self: Self;
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

  console.log("Gotten data", dataToGet);

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
};

export const getUser = (index: Vector2) => {
  const columns = data.users[index[0]];

  return columns ? columns[index[1]] || null : null;
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
