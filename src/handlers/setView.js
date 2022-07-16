import middyfy from "../lib/middyfy"
import { JsonResponse } from "../lib/JsonResponse";
import { Dynamo } from "../lib/dynamo";

const setView = async (event) => {
  const { uuid } = event.pathParameters;

  const dynamo = new Dynamo();

  const viewedSecret = await dynamo.update(uuid);

  return JsonResponse._204(viewedSecret);
}

export const handler = middyfy(setView);
