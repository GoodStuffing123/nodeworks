import { DataConnection } from "peerjs";
import { UserDocument } from "../database/types";

export interface ConnectedPeer {
  user: UserDocument;
  connection: DataConnection;
  lastPing?: number;
}
