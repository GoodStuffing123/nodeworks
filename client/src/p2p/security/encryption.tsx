import { DataPackage } from "../data/types";

export const generateKeys = async () => {
  const cryptoKeys = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "sha-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  return cryptoKeys;
};

export const exportCryptoKeyPair = async (
  cryptoKeys: CryptoKeyPair | Promise<CryptoKeyPair>,
) => {
  const waitedKeys = await cryptoKeys;

  return {
    publicKey: await crypto.subtle.exportKey("jwk", waitedKeys.publicKey),
    privateKey: await crypto.subtle.exportKey("jwk", waitedKeys.privateKey),
  };
};

export const encryptData = async (
  dataToEncrypt: DataPackage<any>,
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

export const decryptData = async (
  dataToDecrypt: ArrayBuffer,
  privateKey: CryptoKey,
): Promise<DataPackage<any>> => {
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
