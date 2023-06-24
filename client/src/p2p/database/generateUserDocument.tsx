import { UserDocument } from "./types";

const generateUserDocument = (userData: UserDocument): UserDocument => ({
  ...userData,
  lastConnection: new Date(),
  discoveredAt: new Date(),
});

export default generateUserDocument;
