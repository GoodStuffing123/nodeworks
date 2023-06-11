import { Vector2 } from "../p2p/indexing/types";

const primeNumbers = [
  1, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 97,
];

const randomIterationWithinRange = (
  index: number,
  end: number,
  prime: number,
  offset: number,
) => {
  return (index * prime + offset) % end;
};

export const iterateRandomlyWithinRange = (
  start: number,
  end: number,
  callback: (index: number, cancel: () => void) => void,
) => {
  const prime = primeNumbers[Math.floor(Math.random() * primeNumbers.length)];
  const offset = Math.floor(Math.random() * end);

  const neutralEnd = end - start;

  let canceled = false;
  for (let i = 0; i < neutralEnd && !canceled; i++) {
    let index =
      randomIterationWithinRange(i, neutralEnd, prime, offset) + start;

    callback(index, () => (canceled = true));
  }
};

const wrap2DVectorAroundPoint = (
  center: Vector2,
  index: number,
  distance: number,
): Vector2 => {
  return [
    // x
    (index <= distance * 2
      ? index
      : index <= distance * 4
      ? distance * 2
      : index <= distance * 6
      ? distance * 6 - index
      : 0) -
      distance +
      center[0],

    // y
    (index <= distance * 2
      ? 0
      : index <= distance * 4
      ? index - distance * 2
      : index <= distance * 6
      ? distance * 2
      : distance * 8 - index) -
      distance +
      center[1],
  ];
};

export const iterate2DMatrixFromCenter = (
  start: Vector2,
  maxDistance: number,
  callback: (position: Vector2, cancel: () => void) => void,
) => {
  for (let d = 1; d <= maxDistance; d++) {
    for (let index = 0; index < d * 8; index++) {
      const position = wrap2DVectorAroundPoint(start, index, d);

      callback(position, () => null);
    }
  }
};

export const iterateRandom2DMatrixFromCenter = (
  start: Vector2,
  maxDistance: number,
  callback: (position: Vector2, cancel: () => void) => void,
) => {
  for (let d = 1; d <= maxDistance; d++) {
    iterateRandomlyWithinRange(0, d * 8, (index, cancel) => {
      const position = wrap2DVectorAroundPoint(start, index, d);

      callback(position, cancel);
    });
  }
};
