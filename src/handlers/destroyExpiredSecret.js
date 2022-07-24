import { Dynamo } from "../lib/dynamo";

export const handler = async (event) => {
  const dynamo = new Dynamo();
  const todayTimestamp = new Date().getTime();

  // catch the expired secrets and delete them
  const secrets = await dynamo.scan();

  if (!secrets) {
    return;
  }

  secrets.forEach(async (secret) => {
    if (secret.expiration <= todayTimestamp) {
      await dynamo.destroy(secret.uuid);
    }
  });
}
