import middyfy from "../lib/middyfy"
import aes256 from "aes256";
import { JsonResponse } from "../lib/JsonResponse";
import { Dynamo } from "../lib/dynamo";
import createHttpError from "http-errors";
import { setView } from "./setView";

const getSecret = async (event) => {
  const { uuid, encryptionKey } = event.pathParameters;
  const password = '';

  if (event.body && event.body.hasOwnProperty('password')) {
    password = event.body.password;
  }

  const dynamo = new Dynamo();

  const secret = await dynamo.get(uuid);

  if (!secret) {
    console.log(secret);
    throw new createHttpError.NotFound("Segredo não existe");
  }

  if (password && password !== aes256.decrypt(encryptionKey, secret.password)) {
    throw new createHttpError.Unauthorized("Senha incorreta");
  }

  const data = await setView(dynamo, encryptionKey, secret);
  console.log(secret);
  return JsonResponse._200(data);
}

export const handler = middyfy(getSecret);
