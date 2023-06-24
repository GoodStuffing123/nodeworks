import { connectedPeers } from "./index";
import handleData, { send } from "../data/peerDataHandler";
import { createUser, generatePublicUserData, self } from "../data/user";

import { DataPackage, dataTypes } from "../data/types";
import { ConnectedPeer } from "./types";

const handleOpen = (
  connectedPeer: ConnectedPeer,
  initiator = false,
  resolve: (value: boolean | PromiseLike<boolean>) => void,
) => {
  connectedPeers.push(connectedPeer);

  connectedPeer.connection.on("data", (data: DataPackage<any>) =>
    handleData(data, connectedPeer),
  );

  if (self.user) {
    send(
      {
        type: dataTypes.SEND_SELF,
        payload: generatePublicUserData(self.user),
      },
      connectedPeer,
    );

    resolve(true);
  } else if (initiator) {
    createUser(connectedPeer, resolve);
  } else {
    resolve(true);
  }
};

export default handleOpen;
