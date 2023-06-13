import { Vector2 } from "../indexing/types";

export interface UserDocument {
  name: string;
  publicKey: JsonWebKey;
  index: Vector2;
  // trust: number;
  discoveredAt: Date;
  lastConnection: Date;
  // credits: number;
}

export interface Self {
  name: string;
  index: Vector2;
  createdAt: Date;

  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}
