import React, { useState } from "react";
import InfoPopup from "./InfoPopup";

import { ConnectedPeer } from "../../p2p/types";

import styled from "styled-components";

const PeerConnectionsListStyles = styled.ul`
  li {
    list-style: none;
    padding: 5px;
    margin: 5px;
    background-color: #181818;
    border-radius: 5px;

    transition: background-color 0.3s;

    &:hover {
      background-color: #222222;
    }
  }
`;

const PeerConnectionsList = ({
  connectedPeers,
}: {
  connectedPeers: ConnectedPeer[];
}) => {
  const [selectedPeer, setSelectedPeer] = useState<ConnectedPeer>();

  return (
    <PeerConnectionsListStyles className="bordered-container popup-animation delay-2">
      {connectedPeers.map((peer) => (
        <li key={peer.connection.peer} onClick={() => setSelectedPeer(peer)}>
          {peer.connection.peer}
        </li>
      ))}

      {selectedPeer && (
        <InfoPopup position={[0, 0]} close={() => setSelectedPeer(null)}>
          {selectedPeer.user ? (
            <>
              <p>
                Index: {selectedPeer.user.index[0]},{" "}
                {selectedPeer.user.index[1]}
              </p>
              <p>Public Key: {selectedPeer.user.publicKey.n}</p>
            </>
          ) : (
            <p>Peer has no user registry.</p>
          )}
        </InfoPopup>
      )}
    </PeerConnectionsListStyles>
  );
};

export default PeerConnectionsList;
