import React, { useEffect, useRef } from "react";

import { ConnectedPeer } from "../../p2p/types";

import styled from "styled-components";

const PeerVisualizerStyles = styled.canvas`
  background-color: #202020;
  border-radius: 10px;
`;

const PeerVisualizer = ({
  connectedPeers,
}: {
  connectedPeers: ConnectedPeer[];
}) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const ctxRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    const Canvas = canvasRef.current;

    ctxRef.current = Canvas.getContext("2d");
  }, [canvasRef.current]);

  useEffect(() => {
    const Canvas = canvasRef.current;

    Canvas.style.width = "200px";
    Canvas.style.height = "200px";

    Canvas.width = parseInt(Canvas.style.width) * 2;
    Canvas.height = parseInt(Canvas.style.height) * 2;

    const ctx = ctxRef.current;

    const center = [Canvas.width / 2, Canvas.height / 2];

    ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(center[0], center[1], 10, 0, Math.PI * 2);
    ctx.fill();

    connectedPeers.forEach((peer, i) => {
      const rotation = (i * (Math.PI * 2)) / connectedPeers.length;

      ctx.beginPath();
      ctx.arc(
        center[0] + Math.cos(rotation) * 50,
        center[1] + Math.sin(rotation) * 50,
        8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });
  }, [connectedPeers]);

  return (
    <PeerVisualizerStyles ref={canvasRef} className="popup-animation delay-1" />
  );
};

export default PeerVisualizer;
