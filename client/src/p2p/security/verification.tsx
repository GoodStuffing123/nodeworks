import { DataConnection } from "peerjs";
// import crypto from "crypto";
import { DataPackage, dataTypes } from "../data/peerDataHandler";

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
