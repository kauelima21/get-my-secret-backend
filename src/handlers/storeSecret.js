import aes256 from "aes256";
import middyfy from "../lib/middyfy"
import shortUUID from "short-uuid";
import createHttpError from "http-errors";
import { JsonResponse } from "../lib/JsonResponse";
import { Secret } from "../model/Secret";
import { Dynamo } from "../lib/dynamo";

const storeSecret = async (event) => {
  if (!event.body && !event.body.hasOwnProperty('content') && event.body.content) {
    throw new createHttpError.InternalServerError("Não pode criar segredos vazios.");
  }

  const { content } = event.body;
  const encryptionKey = shortUUID.generate();
  
  let password = '';

  if (event.body.hasOwnProperty('password') && event.body.password) {
    password = aes256.encrypt(encryptionKey, event.body.password);
  }

  const secret = new Secret(aes256.encrypt(encryptionKey, content));

  const dynamo = new Dynamo();

  let data = secret;

  if (password) {
    data = { ...data, password };
  }

  await dynamo.store(data);
  return JsonResponse._201({ secretUUID: secret.uuid, encryptionKey });
}

export const handler = middyfy(storeSecret);
