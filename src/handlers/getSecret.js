import middyfy from "../lib/middyfy";
import createHttpError from "http-errors";
import { JsonResponse } from "../lib/JsonResponse";
import { Dynamo } from "../lib/dynamo";

const getSecret = async (event) => {
  const { uuid } = event.pathParameters;
  const dynamo = new Dynamo();
  const secret = await dynamo.get(uuid);

  if (!secret) {
    throw new createHttpError.NotFound("Segredo não existe");
  }

  return JsonResponse._200(secret);
}

export const handler = middyfy(getSecret);
