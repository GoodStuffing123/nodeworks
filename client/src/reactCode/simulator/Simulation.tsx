import React, { useEffect, useState } from "react";
import NodeVisualizer from "./NodeVisualizer";
import { Node, totalConnections } from "./nodes";

export let nodes: Node[] = [];

const DataIndexing = () => {
  const [extraData, setExtraData] = useState<any>({});

  const generateNode = (connect = true) => {
    const newNode = new Node();

    if (connect) {
      newNode.connect(nodes[0]);
    } else {
      newNode.index = [0, 0];
    }

    nodes.push(newNode);
  };

  useEffect(() => {
    let i = 0;
    const dataVisualizerInterval = setInterval(() => {
      setExtraData({
        totalNodes: nodes.length,
        totalConnections,
      });

      if (i < nodes.length) {
        if (i > 0) {
          nodes[i - 1].cycling = false;
        }
        nodes[i].cycling = true;

        nodes[i].cycle();

        i++;
      } else if (nodes.length) {
        nodes[i - 1].cycling = false;
        i = 0;
      }
    }, 50);

    return () => {
      clearInterval(dataVisualizerInterval);
    };
  }, []);

  return (
    <>
      <h1>Data Index Testing!</h1>

      {nodes.length ? (
        <div>
          <button onClick={() => generateNode()}>Add Node</button>
        </div>
      ) : (
        <button onClick={() => generateNode(false)}>Begin Simulation</button>
      )}

      <h3>Extra Data:</h3>
      <div>
        {Object.keys(extraData).map((key) => (
          <p key={key}>
            {key}: {extraData[key]}
          </p>
        ))}
      </div>

      <NodeVisualizer />
    </>
  );
};

export default DataIndexing;
