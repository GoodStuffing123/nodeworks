import React, { useEffect, useState } from "react";
import { DataConnection } from "peerjs";

import Router from "./Router";
import LoadingSplash from "./components/LoadingSplash";
// import Simulation from "./simulator/Simulation";

import { PeerContext } from "./components/Context";

import { connect, disconnect } from "../p2p/webConnect";

const Connect = () => {
  const [connected, setConnected] = useState(false);
  const [peerConnections, setPeerConnections] = useState<DataConnection[]>([]);

  useEffect(() => {
    connect(setPeerConnections);

    return () => {
      disconnect(setPeerConnections);
    };
  }, []);

  useEffect(() => {
    if (peerConnections.length) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [peerConnections]);

  return connected ? (
    <PeerContext.Provider value={{ peerConnections, setPeerConnections }}>
      <Router />
    </PeerContext.Provider>
  ) : (
    <LoadingSplash />
  );
  // return <Simulation />;
};

export default Connect;
