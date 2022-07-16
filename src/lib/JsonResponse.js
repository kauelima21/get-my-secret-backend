export const JsonResponse = {
  _200(data) {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  },
  _201(data) {
    return {
      statusCode: 201,
      body: JSON.stringify(data),
    }
  },
  _204(data) {
    return {
      statusCode: 204,
      body: JSON.stringify(data),
    }
  },
}
