import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataConnection } from "peerjs";

import Router from "./Router";
import LoadingSplash from "./components/LoadingSplash";
// import Simulation from "./simulator/Simulation";

import { PeerContext } from "./components/Context";

import { connect, disconnect } from "../p2p/webConnect";

export let setPeerConnections: (value: DataConnection[]) => void;

const Connect = () => {
  const [connected, setConnected] = useState(false);

  const connectionsState = useState<DataConnection[]>([]);
  const peerConnections = connectionsState[0];
  setPeerConnections = (value) => {
    connectionsState[1]([...value]);
  };

  const [isCentral, setIsCentral] = useState(false);

  const startConnection = () => {
    console.log("CONNECTING");

    connect(isCentral ? process.env.REACT_APP_CENTRAL_PEER_NAME : null);

    return () => {
      console.log("DISCONNECTING");

      disconnect();
    };
  };

  useEffect(() => {
    if (peerConnections.length) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [peerConnections]);

  return connected ? (
    // <PeerContext.Provider value={{ peerConnections, setPeerConnections }}>
    <Router {...{ peerConnections, setPeerConnections }} />
  ) : (
    // </PeerContext.Provider>
    <>
      <LoadingSplash />

      <input
        type="checkbox"
        checked={isCentral}
        onChange={() => setIsCentral(!isCentral)}
      />
      <span>is central</span>

      <br />
      <button onClick={startConnection}>Connect</button>
    </>
  );
  // return <Simulation />;
};

export default Connect;
