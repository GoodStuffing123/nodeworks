import React, { Dispatch, SetStateAction } from "react";
import PeerConnectionsList from "../components/PeerConnectionsList";
import PeerVisualizer from "../components/PeerVisualizer";
import ChatBox from "reactCode/components/ChatBox";

import { Self } from "../../p2p/database/types";
import { ConnectedPeer } from "../../p2p/connection/types";

import styled from "styled-components";

const MainPageStyles = styled.div`
  .peer-data-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
      <h1 className="popup-animation">Hello, {self.name}</h1>

      <div className="peer-data-container">
        <div>
          <PeerConnectionsList connectedPeers={connectedPeers} />

          <ChatBox self={self} />
        </div>

        <div>
          <PeerVisualizer connectedPeers={connectedPeers} />
        </div>
      </div>
    </MainPageStyles>
  );
};

export default MainPage;
