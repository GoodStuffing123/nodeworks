import { DataConnection } from "peerjs";
import { DataPackage, dataTypes } from "../data/types";

export const solvePeer = (
  peerConnection: DataConnection,
  callback: () => void,
) => {
  const data: DataPackage = {
    type: dataTypes.GET_PEER_DATA,
    payload: null,
  };

  peerConnection.send(data);
};
