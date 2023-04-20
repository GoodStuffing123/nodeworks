import { NodeIndex, NodeMemory } from "./nodes";

export const verifyDataArray = (data: any[]) => {
  const processedData: { data: any, recurrence: number }[] = [];

  data.forEach((item) => {
    const dataIndex = processedData.findIndex((processedItem) => processedItem.data === item);

    if (dataIndex !== -1) {
      processedData[dataIndex].recurrence++;
    } else {
      processedData.push({
        data: item,
        recurrence: 1,
      });
    }
  });

  processedData.sort((a, b) => b.recurrence - a.recurrence);
  if (processedData[1] && processedData[0].recurrence === processedData[1].recurrence) {
    return null;
  } else {
    return processedData[0];
  }
}

export const findNodeMemoryByIndex = (nodes: NodeMemory[][], index: NodeIndex) => {
  const [x, y] = index;
  const yNodes = nodes[x] || [];
  return yNodes[y] || null;
}
