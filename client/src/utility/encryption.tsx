export const randomKey = (keyLength: number) => {
  let newKey = "";
  for (let i = 0; i < keyLength; i++) {
    newKey += String.fromCharCode(Math.floor(Math.random() * 94 + 32));
  }
  return newKey;
}
