import Peer, { DataConnection } from "peerjs";
import { PrivateUserData, UserDocument } from "../database/types";

export interface Self {
  peer: Peer;
  user: PrivateUserData;
}

export interface ConnectedPeer {
  user: UserDocument;
  connection: DataConnection;
  lastPing?: number;
}
