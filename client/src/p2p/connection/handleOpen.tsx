import { getData } from "../database";
import handleData, { send } from "../data/peerDataHandler";

import { Self, UserDocument } from "../database/types";
import { DataPackage, dataTypes } from "../data/types";
import { ConnectedPeer } from "./types";

const handleOpen = (connectedPeer: ConnectedPeer) => {
  connectedPeer.connection.on("data", (data: DataPackage) =>
    handleData(data, connectedPeer),
  );

  console.log("CONNECTED TO " + connectedPeer.connection.peer);

  const self: Self = getData(["self"]);
  if (self) {
    const publicSelf: UserDocument = {
      name: self.name,
      index: self.index,
      publicKey: self.publicKey,

      discoveredAt: null,
      lastConnection: null,
    };

    send(
      {
        type: dataTypes.SEND_USER,
        payload: publicSelf,
      },
      connectedPeer,
      // recieveConnectedUser,
    );
  } else {
    console.error("I don't have a user!");
  }
};

export default handleOpen;
