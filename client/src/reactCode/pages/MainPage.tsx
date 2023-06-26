import React, { Dispatch, SetStateAction } from "react";
import PeerConnectionsList from "../components/PeerConnectionsList";
import PeerVisualizer from "../components/PeerVisualizer";
import ChatBox from "reactCode/components/ChatBox";

import destroy from "p2p/connection/destroy";

import { ConnectedPeer, Self } from "../../p2p/connection/types";

import styled, { DefaultTheme } from "styled-components";

const MainPageStyles = styled.div`
  h1 {
    display: inline;
  }

  .disconnect-button {
    display: inline;
    float: right;
  }

  .peer-data-container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    & > div {
      width: 40vw;
    }
  }
`;

const MainPage = ({
  self,
  connectedPeers,
  setConnecting,
  theme,
}: {
  self: Self;
  connectedPeers: ConnectedPeer[];
  setConnectedPeers: Dispatch<SetStateAction<ConnectedPeer[]>>;
  setConnecting: Dispatch<SetStateAction<boolean>>;
  theme: DefaultTheme;
}) => {
  return (
    <MainPageStyles>
      <h1 className="popup-animation">Hello, {self.user.username}</h1>

      <button
        className="disconnect-button"
        onClick={() => {
          setConnecting(false);
          destroy();
        }}
      >
        Disconnect
      </button>

      <div className="peer-data-container">
        <div>
          <PeerConnectionsList connectedPeers={connectedPeers} />

          <ChatBox self={self} />
        </div>

        <div>
          <div className="bordered-container popup-animation delay-5">
            <h3>Index in network</h3>
            <p>Includes your index and connected peers</p>
            <PeerVisualizer connectedPeers={connectedPeers} theme={theme} />
          </div>
        </div>
      </div>
    </MainPageStyles>
  );
};

export default MainPage;
