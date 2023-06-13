import { ConnectedPeer } from "../connection/types";
import { send } from "../data/peerDataHandler";
import { DataPackage, dataTypes } from "../data/types";

export const solvePeer = (
  peerConnection: ConnectedPeer,
  callback: () => void,
) => {
  const data: DataPackage = {
    type: dataTypes.GET_PEER_DATA,
  };

  send(data, peerConnection);
};
