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
  const self: Self = getData(["self"]);

  ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  ctx.save();
  ctx.translate(center[0], center[1]);

  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 2;

  const gridLineCount = 5;
  const halvedGridLineCount = Math.floor(gridLineCount / 2);
  const canvasGridPosMultiplier = Canvas.width / gridLineCount;

  for (let x = -halvedGridLineCount; x <= halvedGridLineCount; x++) {
    const posX = x * canvasGridPosMultiplier;

    ctx.beginPath();
    ctx.moveTo(posX, -center[1]);
    ctx.lineTo(posX, center[1]);
    ctx.stroke();
  }

  for (let y = -2; y <= 2; y++) {
    const posY = y * canvasGridPosMultiplier;

    ctx.beginPath();
    ctx.moveTo(-center[0], posY);
    ctx.lineTo(center[0], posY);
    ctx.stroke();
  }

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#202020";
  ctx.lineWidth = 24;

  ctx.beginPath();
  ctx.arc(0, 0, canvasGridPosMultiplier / 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = `${0.15 * canvasGridPosMultiplier}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${self.index[0]},${self.index[1]}`, 0, 0);

  connectedPeers.forEach((connectedPeer, i) => {
    const peerIndex = connectedPeer.user?.index;

    if (peerIndex && self?.index) {
      const nodePos: Vector2 = [
        (peerIndex[0] - self.index[0]) * canvasGridPosMultiplier,
        (peerIndex[1] - self.index[1]) * canvasGridPosMultiplier,
      ];

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      ctx.arc(
        (peerIndex[0] - self.index[0]) * canvasGridPosMultiplier,
        (peerIndex[1] - self.index[1]) * canvasGridPosMultiplier,
        canvasGridPosMultiplier / 4,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = "#000000";

      ctx.fillText(`${peerIndex[0]},${peerIndex[1]}`, nodePos[0], nodePos[1]);
    }
  });

  ctx.restore();
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

    Canvas.style.width = "300px";
    Canvas.style.height = "300px";

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
