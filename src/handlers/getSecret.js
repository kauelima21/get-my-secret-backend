import middyfy from "../lib/middyfy"
import aes256 from "aes256";
import { JsonResponse } from "../lib/JsonResponse";
import { Dynamo } from "../lib/dynamo";
import createHttpError from "http-errors";

const getSecret = async (event) => {
  const { uuid, encryptionKey } = event.pathParameters;
  const passwordFromBody = '';

  if (event.body.password) {
    passwordFromBody = event.body.password;
  }

  const dynamo = new Dynamo();

  const { content, password } = await dynamo.get(uuid);

  if (!passwordFromBody) {
    return JsonResponse._200(aes256.decrypt(encryptionKey, content));
  }

  if (passwordFromBody !== aes256.decrypt(encryptionKey, password)) {
    throw new createHttpError.Unauthorized();
  }

  return JsonResponse._200(aes256.decrypt(encryptionKey, content));
}

export const handler = middyfy(getSecret);
