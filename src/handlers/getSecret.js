import aes256 from "aes256";
import middyfy from "../lib/middyfy";
import createHttpError from "http-errors";
import { Dynamo } from "../lib/dynamo";
import { JsonResponse } from "../lib/JsonResponse";

const getSecret = async (event) => {
  const { uuid, encryptionKey } = event.pathParameters;
  const password = '';

  if (event.body && event.body.hasOwnProperty('password')) {
    password = event.body.password;
  }

  const dynamo = new Dynamo();

  const secret = await dynamo.get(uuid);

  if (!secret) {
    throw new createHttpError.NotFound("Segredo não existe");
  }

  if (secret.views > 0) {
    await dynamo.destroy(secret.uuid);
    throw new createHttpError.NotFound("Segredo não existe");
  }

  if (password && password !== aes256.decrypt(encryptionKey, secret.password)) {
    throw new createHttpError.Unauthorized("Senha incorreta");
  }

  const data = aes256.decrypt(encryptionKey, secret.content);
  await dynamo.update(uuid);

  return JsonResponse._200(data);
}

export const handler = middyfy(getSecret);
