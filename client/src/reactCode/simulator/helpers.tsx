import { NodeIndex, NodeMemory } from "./nodes";

export const findNodeMemoryByIndex = (nodes: NodeMemory[][], index: NodeIndex) => {
  const [x, y] = index;
  const yNodes = nodes[x] || [];
  return yNodes[y] || null;
}
