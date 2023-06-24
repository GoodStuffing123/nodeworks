import React, { Dispatch, SetStateAction } from "react";
import PeerConnectionsList from "../components/PeerConnectionsList";
import PeerVisualizer from "../components/PeerVisualizer";
import ChatBox from "reactCode/components/ChatBox";

import { ConnectedPeer, Self } from "../../p2p/connection/types";

import styled from "styled-components";

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
}: {
  self: Self;
  connectedPeers: ConnectedPeer[];
  setPeerConnections: Dispatch<SetStateAction<ConnectedPeer[]>>;
}) => {
  return (
    <MainPageStyles>
      <h1 className="popup-animation">Hello, {self.user.username}</h1>

      <button className="disconnect-button">Disconnect</button>

      <div className="peer-data-container">
        <div>
          <PeerConnectionsList connectedPeers={connectedPeers} />

          <ChatBox self={self} />
        </div>

        <div>
          <div className="bordered-container popup-animation delay-5">
            <h3>Index in network</h3>
            <p>Includes your index and connected peers</p>
            <PeerVisualizer connectedPeers={connectedPeers} />
          </div>
        </div>
      </div>
    </MainPageStyles>
  );
};

export default MainPage;
