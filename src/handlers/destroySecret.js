import middyfy from "../lib/middyfy"
import { JsonResponse } from "../lib/JsonResponse";
import { Dynamo } from "../lib/dynamo";

const destroySecret = async (event) => {
  const { uuid } = event.pathParameters;

  const dynamo = new Dynamo();

  await dynamo.destroy(uuid);

  return JsonResponse._204({ message: "Secret destroyed" });
}

export const handler = middyfy(destroySecret);
