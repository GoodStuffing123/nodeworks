import React, { useContext } from "react";
import { PeerContext } from "../components/Context";

import styled from "styled-components";

const MainPageStyles = styled.div``;

const MainPage = () => {
  const { peerConnections, setPeerConnections } = useContext(PeerContext);

  return (
    <MainPageStyles>
      <h1>Main Page!</h1>

      <div className="connected-peers">
        {peerConnections.map((peerConnection) => (
          <span key={peerConnection.peer}>{peerConnection.peer}</span>
        ))}
      </div>
    </MainPageStyles>
  );
}

export default MainPage;
