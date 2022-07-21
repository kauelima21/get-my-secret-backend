import middyfy from "../lib/middyfy";
import createHttpError from "http-errors";
import { Dynamo } from "../lib/dynamo";
import { JsonResponse } from "../lib/JsonResponse";

const hasSecret = async (event) => {
  const dynamo = new Dynamo();

  const secret = await dynamo.get(event.pathParameters.uuid);

  if (!secret) {
    throw new createHttpError.NotFound("Segredo não existe");
  }

  if (!secret.hasOwnProperty('password')) {
    throw new createHttpError.NotFound("Segredo não possui senha");
  }

  return JsonResponse._200({ message: "Segredo com senha" });
}

export const handler = middyfy(hasSecret);

