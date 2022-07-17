export const JsonResponse = {
  _200(data) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data),
    }
  },
  _201(data) {
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data),
    }
  },
  _204(data) {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data),
    }
  },
}
