import { setData } from "../../database";
import { sendWithResponse, send } from "../peerDataHandler";
import { exportCryptoKeyPair, generateKeys } from "../../security/encryption";

import { DataPackage, dataTypes, PublicUserData } from "../types";
import { PrivateUserData } from "../../database/types";
import { ConnectedPeer, Self } from "../../connection/types";
import { Vector2 } from "../../indexing/types";

export let self: Self = {
  peer: null,
  user: null,
};
export const setSelf = (data: Self) => {
  self = data;
  setData(["self"], self);
};

export let username: string;
export const setUsername = (newUsername: string) => (username = newUsername);

export const generatePublicUserData = ({
  username,
  index,
  publicKey,
}: PrivateUserData): PublicUserData => ({
  username,
  index,
  publicKey,
});

export const createUser = async (
  connectedPeer: ConnectedPeer,
  resolve?: (value: boolean | PromiseLike<boolean>) => void,
) => {
  const { payload: newIndex }: DataPackage<Vector2> = await sendWithResponse(
    {
      type: dataTypes.FIND_FREE_INDEX,
    },
    connectedPeer,
  );

  const encryptionKeys = await exportCryptoKeyPair(generateKeys());

  const privateSelfData: PrivateUserData = {
    username: username,
    index: newIndex,
    createdAt: new Date(),

    ...encryptionKeys,
  };

  const publicSelfData = generatePublicUserData(privateSelfData);

  send(
    {
      type: "REGISTER_USER",
      payload: publicSelfData,
    },
    connectedPeer,
  );

  setSelf({
    peer: self.peer,
    user: privateSelfData,
  });

  if (resolve) resolve(true);
};
