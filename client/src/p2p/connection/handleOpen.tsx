import { getData } from "../database";
import handleData, { send } from "../data/peerDataHandler";
import { createUser } from "../data/user";

import { Self, UserDocument } from "../database/types";
import { DataPackage, dataTypes } from "../data/types";
import { ConnectedPeer } from "./types";

const handleOpen = async (
  connectedPeer: ConnectedPeer,
  initiator = false,
  name?: string,
) => {
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
    );
  } else if (initiator) {
    await createUser(name, connectedPeer);
  }
};

export default handleOpen;
