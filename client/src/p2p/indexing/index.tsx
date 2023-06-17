import { iterateRandom2DMatrixFromCenter } from "../../lib/iterators";
import { Vector2 } from "./types";
import { getData, getUser } from "../database";

export const findFreeIndex = () => {
  let foundIndex: Vector2 = null;

  iterateRandom2DMatrixFromCenter(
    getData(["self"])?.index || [0, 0],
    1,
    (position, cancel) => {
      const foundUser = getUser(position);

      if (!foundUser) {
        foundIndex = position;

        cancel();
      }
    },
  );

  return foundIndex;
};

export const matchIndexes = (index1: Vector2, index2: Vector2) =>
  index1[0] === index2[0] && index1[1] === index2[1];
