import aes256 from "aes256";

export const setView = async (dynamo, encryptionKey, { uuid, content }) => {
  const data = aes256.decrypt(encryptionKey, content);
  await dynamo.destroy(uuid);
  return data;
}
