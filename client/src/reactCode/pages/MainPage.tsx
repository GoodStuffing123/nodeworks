import React, { Dispatch, SetStateAction, useContext } from "react";
import { DataConnection } from "peerjs";
// import { PeerContext } from "../components/Context";

import styled from "styled-components";

const MainPageStyles = styled.div``;

const MainPage = ({
  peerConnections,
  setPeerConnections,
}: {
  peerConnections: any[];
  setPeerConnections: Dispatch<SetStateAction<DataConnection[]>>;
}) => {
  return (
    <MainPageStyles>
      <h1>Main Page!</h1>

      <div className="connected-peers">
        {peerConnections.map((peerConnection) => (
          <p key={peerConnection.peer}>{peerConnection.peer}</p>
        ))}
      </div>
    </MainPageStyles>
  );
};

export default MainPage;
