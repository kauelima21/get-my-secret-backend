import aes256 from "aes256";
import middyfy from "../lib/middyfy"
import shortUUID from "short-uuid";
import { JsonResponse } from "../lib/JsonResponse";
import { Secret } from "../model/Secret";
import { Dynamo } from "../lib/dynamo";

const storeSecret = async (event) => {
  const { content, password } = event.body;
  const encryptionKey = shortUUID.generate();

  if (password) {
    password = aes256(encryptionKey, password);
  }

  const secret = new Secret(aes256.encrypt(encryptionKey, content));

  const dynamo = new Dynamo();

  await dynamo.store({ ...secret, password });

  return JsonResponse._201({ secretUUID: secret.uuid, encryptionKey });
}

export const handler = middyfy(storeSecret);
