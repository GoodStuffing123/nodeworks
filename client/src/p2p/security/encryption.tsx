import { DataPackage } from "../data/peerDataHandler";

const generateKeys = async () => {
  const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "sha-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return { publicKey, privateKey };
};

const encryptData = async (
  dataToEncrypt: DataPackage,
  publicKey: CryptoKey,
): Promise<ArrayBuffer> => {
  return await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    new TextEncoder().encode(JSON.stringify(dataToEncrypt)),
  );
};

const decryptData = async (
  dataToDecrypt: ArrayBuffer,
  privateKey: CryptoKey,
): Promise<DataPackage> => {
  return JSON.parse(
    new TextDecoder().decode(
      await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        dataToDecrypt,
      ),
    ),
  );
};

// const testEncryption = async () => {
//   const { publicKey, privateKey } = await generateKeys();

//   const encryptedData = await encryptData(
//     { type: "SEND_MESSAGE", payload: "Hello! This message was encrypted!" },
//     publicKey,
//   );

//   const decryptedData = await decryptData(encryptedData, privateKey);
//   console.log(decryptedData);
// };
// testEncryption();
