import { self } from "../data/user";
import { sendChainWithResponse } from "../data/peerDataHandler";
import { iterateRandom2DMatrixFromCenter } from "../../lib/iterators";
import { getUser } from "../database";

import { Vector2 } from "./types";
import { DataPackage } from "../data/types";

export const findFreeIndex = async (data: DataPackage<undefined>) => {
  let foundIndex: Vector2;
  iterateRandom2DMatrixFromCenter(
    self.user?.index || [0, 0],
    1,
    (position, cancel) => {
      const foundUser = getUser(position);

      if (!foundUser) {
        foundIndex = position;

        cancel();
      }
    },
  );

  if (!foundIndex) {
    foundIndex = (await sendChainWithResponse<Vector2>(data)).payload;
  }

  return foundIndex;
};

export const matchIndexes = (index1: Vector2, index2: Vector2) =>
  index1[0] === index2[0] && index1[1] === index2[1];

export const distanceBetweenIndexes = (index1: Vector2, index2: Vector2) =>
  Math.hypot(index1[0] - index2[0], index1[1] - index2[1]);
