export interface DataPackage {
  type: string;
  payload: any;
}

export interface PeerListener {
  type: string;
  callback: Function;
}

export const dataTypes = {
  GET_PEER_DATA: "GET_PEER_DATA",
};
