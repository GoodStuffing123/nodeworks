import React, { useEffect, useRef } from "react";

import { ConnectedPeer } from "../../p2p/connection/types";
import { Vector2 } from "../../p2p/indexing/types";

import { self } from "../../p2p/data/user";

import styled, { DefaultTheme } from "styled-components";

const draw = (
  Canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  center: Vector2,
  connectedPeers: ConnectedPeer[],
  theme: DefaultTheme,
) => {
  ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  ctx.save();
  ctx.translate(center[0], center[1]);

  ctx.strokeStyle = theme.palette.secondary;
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

  ctx.fillStyle = theme.palette.text;

  ctx.beginPath();
  ctx.arc(0, 0, canvasGridPosMultiplier / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme.palette.background;
  ctx.font = `${0.15 * canvasGridPosMultiplier}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${self.user.index[0]},${self.user.index[1]}`, 0, 0);

  connectedPeers.forEach((connectedPeer, i) => {
    const peerIndex = connectedPeer.user?.index;

    if (peerIndex && self.user) {
      const nodePos: Vector2 = [
        (peerIndex[0] - self.user.index[0]) * canvasGridPosMultiplier,
        (peerIndex[1] - self.user.index[1]) * canvasGridPosMultiplier,
      ];

      ctx.fillStyle = theme.palette.text;

      ctx.beginPath();
      ctx.arc(
        (peerIndex[0] - self.user.index[0]) * canvasGridPosMultiplier,
        (peerIndex[1] - self.user.index[1]) * canvasGridPosMultiplier,
        canvasGridPosMultiplier / 4,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      ctx.fillStyle = theme.palette.background;

      ctx.fillText(`${peerIndex[0]},${peerIndex[1]}`, nodePos[0], nodePos[1]);
    }
  });

  ctx.restore();
};

const PeerVisualizerStyles = styled.canvas`
  background-color: ${({ theme }) => theme.palette.primary};
  border-radius: 10px;
`;

const PeerVisualizer = ({
  connectedPeers,
  theme,
}: {
  connectedPeers: ConnectedPeer[];
  theme: DefaultTheme;
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
        draw(canvasRef.current, ctx, center, connectedPeers, theme);

        setTimeout(() => requestAnimationFrame(runAnimation), 1000 / 5);
      }
    };
    runAnimation();

    return () => {
      animationComplete = true;
    };
  }, [connectedPeers, theme]);

  return (
    <PeerVisualizerStyles ref={canvasRef} className="popup-animation delay-1" />
  );
};

export default PeerVisualizer;
