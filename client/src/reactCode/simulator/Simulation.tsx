import React, { useEffect, useState } from "react";
import { Node, totalConnections } from "./nodes";

export let nodes: Node[] = [];

const DataIndexing = () => {
  const [extraData, setExtraData] = useState<any>({});

  const generateNode = (connect = true) => {
    const newNode = new Node();
    nodes = [...nodes, newNode];

    if (connect) {
      newNode.connect(nodes[nodes.length - 1]);
    }
  }

  const cycleNodes = () => {
    nodes.forEach((node) => {
      node.cycle();
    });
  }

  useEffect(() => {
    const dataVisualizerInterval = setInterval(() => {
      setExtraData({
        totalNodes: nodes.length,
        totalConnections,
      });
    }, 70);

    return () => {
      clearInterval(dataVisualizerInterval);
    }
  }, []);

  return (
    <>
      <h1>Data Index Testing!</h1>

      {nodes.length ? (
        <div>
          <button onClick={() => generateNode()}>Add Node</button>

          <button onClick={() => cycleNodes()}>Run Cycle</button>
        </div>
      ) : (
        <button onClick={() => generateNode(false)}>Begin Simulation</button>
      )}

      <h3>Extra Data:</h3>
      <div>
        {Object.keys(extraData).map((key) => (
          <p key={key}>{key}: {extraData[key]}</p>
        ))}
      </div>
    </>
  );
}

export default DataIndexing;
