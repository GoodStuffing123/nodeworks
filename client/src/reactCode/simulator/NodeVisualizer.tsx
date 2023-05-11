import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { matchIndexes } from "./helpers";
import { Node, NodeIndex } from "./nodes";
import { nodes } from "./Simulation";

const nodeDistance = 20;

const NodeVisualizerStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  p {
    margin: 0;

    line-height: 16px;
    font-family: monospace;
  }
`;

const NodeVisualizer = () => {
  const [selectedNode, setSelectedNode] = useState<Node>();

  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = useRef();

  const calcCanvasNodePos = (
    index: NodeIndex,
    center: { x: number; y: number },
  ): [number, number] => {
    return [
      center.x + index[0] * nodeDistance,
      center.y + index[1] * nodeDistance,
    ];
  };

  useEffect(() => {
    const Canvas = canvasRef.current;
    const ctx = Canvas.getContext("2d");

    const center = { x: Canvas.width / 2, y: Canvas.height / 2 };

    const drawInterval = setInterval(() => {
      ctx.clearRect(0, 0, Canvas.width, Canvas.height);

      ctx.strokeStyle = "lightgreen";
      ctx.lineWidth = 2;
      nodes.forEach((node) => {
        if (node.index) {
          const pos: [number, number] = calcCanvasNodePos(node.index, center);

          if (node.cycling) {
            ctx.fillStyle = "red";
          } else {
            ctx.fillStyle = "white";
          }
          ctx.globalAlpha = 0.5;

          node.connectedNodes.forEach((connectedNode) => {
            if (connectedNode.index) {
              const connectedPos: [number, number] = calcCanvasNodePos(
                connectedNode.index,
                center,
              );

              ctx.beginPath();
              ctx.moveTo(...pos);
              ctx.lineTo(...connectedPos);
              ctx.stroke();
            }
          });

          ctx.globalAlpha = 1;

          ctx.beginPath();
          ctx.arc(...pos, nodeDistance * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }, 50);

    return () => {
      clearInterval(drawInterval);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const mousePos = [
      e.clientX - boundingRect.left - canvasRef.current.width / 2,
      e.clientY - boundingRect.top - canvasRef.current.height / 2,
    ];

    const mouseIndexPos: NodeIndex = [
      Math.floor(mousePos[0] / nodeDistance + 0.5),
      Math.floor(mousePos[1] / nodeDistance + 0.5),
    ];

    setSelectedNode(
      nodes.find((node) => matchIndexes(node.index, mouseIndexPos)) || null,
    );
  };

  return (
    <NodeVisualizerStyles>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: "navy" }}
        width={500}
        height={500}
        onClick={handleCanvasClick}
      />

      {selectedNode && (
        <div>
          <p>ID: {selectedNode.id}</p>
          <p>
            Index: {selectedNode.index[0]}, {selectedNode.index[1]}
          </p>
          <p>Connections: {selectedNode.connectedNodes.length}</p>
          <div>
            <p>Stored Nodes:</p>
            {Object.keys(selectedNode.storage.otherNodes).map((sx: string) => {
              const x = parseFloat(sx);
              return Object.keys(selectedNode.storage.otherNodes[x]).map(
                (sy: string) => {
                  const y = parseFloat(sy);
                  const storedNode = selectedNode.storage.otherNodes[x][y];
                  return (
                    <div key={storedNode.id}>
                      <br />

                      <p>Id: {storedNode.id}</p>
                      <p>
                        Index: {storedNode.index[0]}, {storedNode.index[1]}
                      </p>
                      <p>Trust: {storedNode.trust}</p>
                    </div>
                  );
                },
              );
            })}
          </div>
        </div>
      )}
    </NodeVisualizerStyles>
  );
};

export default NodeVisualizer;
