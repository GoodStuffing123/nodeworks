import React, { Dispatch, SetStateAction } from "react";
import PeerConnectionsList from "../components/PeerConnectionsList";
import PeerVisualizer from "../components/PeerVisualizer";

import { ConnectedPeer } from "../../p2p/types";

import styled from "styled-components";

const MainPageStyles = styled.div`
  .peer-data-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const MainPage = ({
  connectedPeers,
}: {
  connectedPeers: ConnectedPeer[];
  setPeerConnections: Dispatch<SetStateAction<ConnectedPeer[]>>;
}) => {
  return (
    <MainPageStyles>
      <h1 className="popup-animation">Hello, GoodStuffing123</h1>

      <div className="peer-data-container">
        <div>
          <PeerConnectionsList connectedPeers={connectedPeers} />
        </div>

        <div>
          <PeerVisualizer connectedPeers={connectedPeers} />
        </div>
      </div>
    </MainPageStyles>
  );
};

export default MainPage;
