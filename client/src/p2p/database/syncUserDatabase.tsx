import { getUser, setUser } from "./index";
import connectToPeer from "../connection/connectToPeer";

import { UserDocument, UserDocumentSyncPackage } from "./types";
import { DataPackage } from "../data/types";

const syncUserDatabase = async (data: DataPackage<UserDocumentSyncPackage>) => {
  data.payload.users.forEach((user: UserDocument) => {
    if (user.index && !getUser(user.index)) {
      setUser(user);
    }
  });

  console.log("Syncing User DB");

  for (let i = 0; i < data.payload.peerIds.length; i++) {
    await connectToPeer(data.payload.peerIds[i]);
  }
};

export default syncUserDatabase;
