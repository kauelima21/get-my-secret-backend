import aes256 from "aes256";
import middyfy from "../lib/middyfy"
import shortUUID from "short-uuid";
import createHttpError from "http-errors";
import { JsonResponse } from "../lib/JsonResponse";
import { Secret } from "../model/Secret";
import { Dynamo } from "../lib/dynamo";

const storeSecret = async (event) => {
  if (!event.body.content) {
    throw new createHttpError.InternalServerError("Não pode criar segredos vazios.");
  }

  const { content } = event.body;
  const encryptionKey = shortUUID.generate();
  
  let password = '';

  if (event.body.password) {
    password = aes256.encrypt(encryptionKey, event.body.password);
  }

  const secret = new Secret(aes256.encrypt(encryptionKey, content));

  const dynamo = new Dynamo();

  if (password) {
    await dynamo.store({ ...secret, password });
    return JsonResponse._201({ secretUUID: secret.uuid, encryptionKey });
  }

  await dynamo.store(secret);
  return JsonResponse._201({ secretUUID: secret.uuid, encryptionKey });
}

export const handler = middyfy(storeSecret);
