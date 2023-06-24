import { Vector2 } from "../indexing/types";

export interface UserDocument {
  username: string;
  publicKey: JsonWebKey;
  index: Vector2;
  // trust: number;
  discoveredAt?: Date;
  lastConnection?: Date;
  // credits: number;
}

export interface PrivateUserData {
  username: string;
  index: Vector2;
  createdAt: Date;

  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface UserDocumentSyncPackage {
  users: UserDocument[];
  peerIds: string[];
}
