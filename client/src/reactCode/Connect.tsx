import React, { useEffect, useState } from "react";

import Router from "./Router";
import LoadingSplash from "./components/LoadingSplash";
// import Simulation from "./simulator/Simulation";

// import { PeerContext } from "./components/Context";

import { connect, disconnect } from "../p2p/webConnect";

import { ConnectedPeer } from "../p2p/types";

export let setConnectedPeers: (value: ConnectedPeer[]) => void;

const Connect = () => {
  const [connected, setConnected] = useState(true);

  const peersState = useState<ConnectedPeer[]>([
    // {
    //   user: {
    //     index: [-1, -1],
    //     publicKey: { k: "0" },
    //     discoveredAt: new Date(),
    //     lastConnection: new Date(),
    //   },
    //   // @ts-ignore
    //   connection: { peer: "0" },
    // },
    // {
    //   user: {
    //     index: [0, -1],
    //     publicKey: { k: "1" },
    //     discoveredAt: new Date(),
    //     lastConnection: new Date(),
    //   },
    //   // @ts-ignore
    //   connection: { peer: "1" },
    // },
    // {
    //   user: {
    //     index: [1, -1],
    //     publicKey: { k: "2" },
    //     discoveredAt: new Date(),
    //     lastConnection: new Date(),
    //   },
    //   // @ts-ignore
    //   connection: { peer: "2" },
    // },
  ]);
  const connectedPeers = peersState[0];
  setConnectedPeers = (value) => {
    peersState[1]([...value]);
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
    if (connectedPeers.length) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [connectedPeers]);

  return connected ? (
    // <PeerContext.Provider value={{ peerConnections, setPeerConnections }}>
    <Router {...{ connectedPeers, setPeerConnections: setConnectedPeers }} />
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
