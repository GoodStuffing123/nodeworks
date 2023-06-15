import React, { useEffect, useState } from "react";

import Router from "./Router";
import LoadingSplash from "./components/LoadingSplash";
// import Simulation from "./simulator/Simulation";

// import { PeerContext } from "./components/Context";

import { connect, disconnect } from "../p2p/connection/webConnect";

import { ConnectedPeer } from "../p2p/connection/types";
import { Self } from "../p2p/database/types";
import UsernameForm from "./components/UsernameForm";

export let setConnectedPeers: (value: ConnectedPeer[]) => void;
export let setSelf: (value: Self) => void;

const Connect = () => {
  const [connected, setConnected] = useState(true);

  const selfState = useState<Self>();
  const self = selfState[0];
  setSelf = (value) => {
    selfState[1](value);
  };

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

  const [username, setUsername] = useState("");
  const [connecting, setConnecting] = useState(false);

  const startConnection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("CONNECTING");

    connect(
      username,
      username === process.env.REACT_APP_CENTRAL_PEER_NAME
        ? process.env.REACT_APP_CENTRAL_PEER_NAME
        : null,
    );

    setConnecting(true);

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

  return connected && self ? (
    // <PeerContext.Provider value={{ peerConnections, setPeerConnections }}>
    <Router
      {...{ self, connectedPeers, setPeerConnections: setConnectedPeers }}
    />
  ) : // </PeerContext.Provider>
  connecting ? (
    <LoadingSplash />
  ) : (
    <UsernameForm
      username={username}
      setUsername={setUsername}
      onSubmit={startConnection}
    />
  );
  // return <Simulation />;
};

export default Connect;
