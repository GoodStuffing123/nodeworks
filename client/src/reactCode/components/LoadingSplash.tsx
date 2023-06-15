import React, { useState, useRef, useEffect } from "react";

import { connectedPeers } from "../../p2p/connection/webConnect";
import { distance } from "../../utility/math";

import { Self } from "../../p2p/database/types";

import styled from "styled-components";

// Set styles for Canvas
const Canvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
`;

// Declare interface for a single animated node
interface AnimNode {
  x: number;
  y: number;
  r: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  wobbleValue: number;
  connectedNodes: number[];
  connectionStrength: number;
  trueX: number;
  trueY: number;
}

// Create an empty array for animated nodes
const nodes: AnimNode[] = [];
// Fill array with nodes
const generateNodes = () => {
  // Declare the first node's position
  let nodePos = { x: -100, y: -100 };

  // Create nodes until the set square area of nodes is filled
  while (nodePos.y <= 100) {
    // Declare node
    const newNode: AnimNode = {
      // Position
      x: nodePos.x + Math.random() * 15 - 7.5,
      y: nodePos.y + Math.random() * 15 - 7.5,

      // Radius
      r: Math.random() * 6 + 4,

      // Values for wobble animation
      wobbleSpeed: Math.random() * 10 - 5,
      wobbleAmount: Math.random() * 2 + 3,
      wobbleValue: 0,

      // Connected nodes for making lines between this node and others
      connectedNodes: [],
      // Width of connection line
      connectionStrength: Math.random() * 3 + 1,

      // True position of node after animation is calculated
      trueX: 0,
      trueY: 0,
    };

    // Add connected node indexes to current node's connected nodes array
    nodes.forEach((oldNode, i) => {
      // Connect nodes if a random number is less than a certain size and the nodes are close enough together
      if (Math.random() < 0.75 && distance(newNode, oldNode) < 60) {
        newNode.connectedNodes.push(i);
      }
    });

    // Add node to nodes array
    nodes.push(newNode);

    // Set position of next node
    if (nodePos.x >= 100) {
      nodePos.x -= 200;
      nodePos.y += 40;
    } else {
      nodePos.x += 40;
    }
  }
};
// Run function to generate nodes
generateNodes();

// Declare last frame timestamp variable
let lastFrame = 0;
// Function to calculate and draw loading animation to the canvas
const draw = (Canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // Find center of screen
  const center = { x: Canvas.width / 2, y: Canvas.height / 2 };
  // Clear the canvas
  ctx.clearRect(0, 0, Canvas.width, Canvas.height);

  // Set time since last frame in seconds for calculating the animation speed on monitors with different refresh rates
  const thisFrame = Date.now();
  const deltaTime = (thisFrame - lastFrame) / 1000;
  // Set time since the last frame to now for
  lastFrame = thisFrame;

  // Set canvas to drawing color
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";

  // Draw nodes and their connectors to the canvas
  nodes.forEach((node: AnimNode) => {
    node.wobbleValue += node.wobbleSpeed * deltaTime;

    node.trueX =
      center.x + node.x + Math.cos(node.wobbleValue) * node.wobbleAmount;
    node.trueY =
      center.y + node.y + Math.sin(node.wobbleValue) * node.wobbleAmount;

    node.connectedNodes.forEach((connectedNodeIndex) => {
      const connectedNode = nodes[connectedNodeIndex];

      ctx.lineWidth = connectedNode.connectionStrength;

      ctx.beginPath();
      ctx.moveTo(node.trueX, node.trueY);
      ctx.lineTo(connectedNode.trueX, connectedNode.trueY);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(node.trueX, node.trueY, node.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw loading text
  ctx.font = "25px monospace";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "center";
  ctx.fillText(
    !connectedPeers.length ? "Connecting" : "Registering",
    center.x,
    Canvas.height - 100,
  );

  // Visualize delta time for debugging
  // ctx.font = "16px monospace";
  // ctx.textBaseline = "top";
  // ctx.textAlign = "right";
  // ctx.fillText(`Delta Time: ${deltaTime}`, 0, 0);
};

const LoadingSplash = () => {
  const [dimentions, setDimentions] = useState({
    width: 0,
    height: 0,
  });

  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = useRef();

  const handleResize = () => {
    setDimentions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    const ctx = canvasRef.current.getContext("2d");

    let animationComplete = false;
    const runAnimation = async () => {
      if (!animationComplete && canvasRef.current) {
        draw(canvasRef.current, ctx);

        requestAnimationFrame(runAnimation);
      }
    };
    runAnimation();

    return () => {
      window.removeEventListener("resize", handleResize);

      animationComplete = true;
    };
  }, []);

  return (
    <Canvas
      ref={canvasRef}
      width={dimentions.width}
      height={dimentions.height}
    />
  );
};

export default LoadingSplash;
