import { generatePublicUserData, self } from "./index";
import { getUser, setUser } from "../../database";
import generateUserDocument from "../../database/generateUserDocument";
import { connectedPeers } from "../../connection";
import { setConnectedPeers } from "../../../reactCode/Connect";

import { ConnectedPeer } from "../../connection/types";
import { DataPackage, PublicUserData } from "../types";

const recieveConnectedUser = (
  data: DataPackage<PublicUserData>,
  connectedPeer: ConnectedPeer,
) => {
  console.log("RECIEVED USER DATA FROM CONNECTED PEER", data.payload);

  const connectedPeerIndex = connectedPeers.findIndex(
    (otherConnectedPeer) =>
      otherConnectedPeer.connection.peer === connectedPeer.connection.peer,
  );

  if (data.payload && data.payload.index) {
    let foundUser = getUser(data.payload.index);
    if (foundUser) {
      connectedPeers[connectedPeerIndex].user = foundUser;
    } else {
      const { payload: newUser } = data;
      connectedPeers[connectedPeerIndex].user = generateUserDocument({
        username: newUser.username,
        index: newUser.index,
        publicKey: newUser.publicKey,
      });
      setUser(connectedPeer.user, connectedPeer);
    }

    setConnectedPeers(connectedPeers);

    return self.user ? generatePublicUserData(self.user) : null;
  } else {
    return self.user ? generatePublicUserData(self.user) : null;
  }
};

export default recieveConnectedUser;
