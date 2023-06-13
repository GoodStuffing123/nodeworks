import React, { useEffect, useRef } from "react";
import { getData } from "../../p2p/database";

import { ConnectedPeer } from "../../p2p/connection/types";
import { Self } from "../../p2p/database/types";
import { Vector2 } from "../../p2p/indexing/types";

import styled from "styled-components";

const draw = (
  Canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  center: Vector2,
  connectedPeers: ConnectedPeer[],
) => {
  const self = getData(["self"]);

  ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  ctx.fillStyle = "#ffffff";

  ctx.beginPath();
  ctx.arc(center[0], center[1], 10, 0, Math.PI * 2);
  ctx.fill();

  connectedPeers.forEach((connectedPeer, i) => {
    const peerIndex = connectedPeer.user?.index;

    if (peerIndex && self?.index) {
      ctx.beginPath();
      ctx.arc(
        center[0] + (peerIndex[0] - self.index[0]) * 50,
        center[1] + (peerIndex[1] - self.index[1]) * 50,
        8,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  });
};

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

    const center: Vector2 = [Canvas.width / 2, Canvas.height / 2];

    let animationComplete = false;
    const runAnimation = async () => {
      if (!animationComplete && canvasRef.current) {
        draw(canvasRef.current, ctx, center, connectedPeers);

        setTimeout(() => requestAnimationFrame(runAnimation), 1000 / 5);
      }
    };
    runAnimation();

    return () => {
      animationComplete = true;
    };
  }, [connectedPeers]);

  return (
    <PeerVisualizerStyles ref={canvasRef} className="popup-animation delay-1" />
  );
};

export default PeerVisualizer;
