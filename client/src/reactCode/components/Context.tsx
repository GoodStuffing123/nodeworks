import React from "react";
import { DataConnection } from "peerjs";

export interface PeerContextContent {
  peerConnections: DataConnection[],
  setPeerConnections: React.Dispatch<React.SetStateAction<DataConnection[]>>,
}
export const PeerContext = React.createContext<PeerContextContent>(null);
