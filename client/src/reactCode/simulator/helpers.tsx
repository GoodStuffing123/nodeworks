import { NodeIndex, NodeMemory } from "./nodes";

export interface VerifiedData {
  data: any;
  recurrence: number;
  index?: number;
}

export const compressDataArray = (data: any[]) => {
  const processedData: VerifiedData[] = [];

  data.forEach((item) => {
    const dataIndex = processedData.findIndex(
      (processedItem) => processedItem.data === item,
    );

    if (dataIndex !== -1) {
      processedData[dataIndex].recurrence++;
    } else {
      processedData.push({
        data: item,
        recurrence: 1,
      });
    }
  });

  return processedData;
};

export const verifyDataArray = (data: any[]) => {
  const processedData = compressDataArray(data);

  processedData.sort((a, b) => b.recurrence - a.recurrence);
  if (
    processedData.length > 1 &&
    processedData[0].recurrence === processedData[1].recurrence
  ) {
    return null;
  } else {
    return processedData[0];
  }
};

export const findNodeMemoryByIndex = (
  nodes: NodeMemory[][],
  index: NodeIndex,
) => {
  const [x, y] = index;
  const yNodes = nodes[x] || [];
  return yNodes[y] || null;
};

export const matchIndexes = (i1: NodeIndex, i2: NodeIndex) => {
  return i1 && i2 && i1[0] === i2[0] && i1[1] === i2[1];
};

export const loopAround = (maxDist: number) => {};

const primeNumbers = [
  1, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 97,
];

export const randomWithinRange = (
  index: number,
  end: number,
  prime: number,
  offset: number,
) => {
  return (index * prime + offset) % end;
};

export const iterateRandomRange = (
  start: number,
  end: number,
  callback: { (index: number, cancel: Function): void },
) => {
  const prime = primeNumbers[Math.floor(Math.random() * primeNumbers.length)];
  const offset = Math.floor(Math.random() * end);

  const neutralEnd = end - start;

  let canceled = false;
  for (let i = 0; i < neutralEnd && !canceled; i++) {
    let index = randomWithinRange(i, neutralEnd, prime, offset) + start;

    callback(index, () => (canceled = true));
  }
};

export const gridPointFromNumber = (xy: number, maxX: number): NodeIndex => {
  const y = Math.floor(xy / maxX);
  const x = Math.floor(xy - y * maxX);

  return [x, y];
};
