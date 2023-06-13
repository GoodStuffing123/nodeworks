import { Vector2 } from "../indexing/types";
import { ConnectedPeer } from "../connection/types";

export interface DataPackage {
  type: string;
  payload?: any;
  responseCode?: string;
  chainHistory?: Vector2[];
}

export type PeerListenerCallback = (
  data: DataPackage,
  peerConnection: ConnectedPeer,
) => any;

export interface PeerListener {
  type: string;
  callback: PeerListenerCallback;
}

export const dataTypes = {
  TEST: "TEST",
  PING: "PING",

  GET_PEER_DATA: "GET_PEER_DATA",
  FIND_FREE_INDEX: "FIND_FREE_INDEX",

  REGISTER_USER: "REGISTER_USER",
  SEND_USER: "SEND_USER",
  SYNC_USER_DATABASE: "SYNC_USER_DATABASE",

  CHAT_MESSAGE: "CHAT_MESSAGE",
};
