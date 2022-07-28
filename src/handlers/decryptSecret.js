import aes256 from "aes256";
import middyfy from "../lib/middyfy";
import createHttpError from "http-errors";
import { Dynamo } from "../lib/dynamo";
import { JsonResponse } from "../lib/JsonResponse";

function verifyPassword(cipher, passwordToVerify, secret) {
  if (passwordToVerify.length === 0 || cipher.decrypt(secret.password) !== passwordToVerify) {
    throw new createHttpError.Unauthorized("Você não pode ver este segredo.");
  }

  return;
}

const decryptSecret = async (event) => {
  const { uuid, encryptionKey } = event.pathParameters;
  const dynamo = new Dynamo();

  const secret = await dynamo.get(uuid);

  if (!secret) {
    throw new createHttpError.NotFound("Segredo não existe");
  }

  const password = (event.body && event.body.hasOwnProperty("password")) ? event.body.password : "";
  const cipher = aes256.createCipher(encryptionKey);

  if (secret.hasOwnProperty("password")) {
    verifyPassword(cipher, password, secret);
  }

  const data = cipher.decrypt(secret.content);

  await dynamo.destroy(uuid);
  return JsonResponse._200(data);
}

export const handler = middyfy(decryptSecret);
