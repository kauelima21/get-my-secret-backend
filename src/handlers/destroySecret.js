import middyfy from "../lib/middyfy"
import createHttpError from "http-errors";
import { Dynamo } from "../lib/dynamo";
import { JsonResponse } from "../lib/JsonResponse";

const destroySecret = async (event) => {
  const dynamo = new Dynamo();

  const secret = await dynamo.get(event.pathParameters.uuid);

  if (!secret) {
    throw new createHttpError.NotFound("Não existe segredo com este uuid");
  }

  await dynamo.destroy(secret.uuid);

  return JsonResponse._204({ message: "Segredo deletado com sucesso!" });
}

export const handler = middyfy(destroySecret);
