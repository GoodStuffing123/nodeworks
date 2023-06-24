import { Vector2 } from "../indexing/types";
import { ConnectedPeer } from "../connection/types";

export interface DataPackage<T> {
  type: string;
  payload?: T;
  responseCode?: string;
  chainHistory?: string[];
}

export type PeerListenerCallback<T> = (
  data: DataPackage<T>,
  peerConnection: ConnectedPeer,
) => any;

export interface PeerListener<T> {
  type: string;
  callback: PeerListenerCallback<T>;
}

export interface PublicUserData {
  username: string;
  index: Vector2;

  publicKey: JsonWebKey;
}

export const dataTypes = {
  TEST: "TEST",
  PING: "PING",

  GET_PEER_DATA: "GET_PEER_DATA",
  FIND_FREE_INDEX: "FIND_FREE_INDEX",

  REGISTER_USER: "REGISTER_USER",
  SEND_SELF: "SEND_SELF",
  REQUEST_SELF: "REQUEST_SELF",
  SYNC_USER_DATABASE: "SYNC_USER_DATABASE",

  CHAT_MESSAGE: "CHAT_MESSAGE",
};
