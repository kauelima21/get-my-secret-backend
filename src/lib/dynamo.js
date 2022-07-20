import AWS from 'aws-sdk';
import createHttpError from "http-errors";

export class Dynamo {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
  TableName = process.env.SECRETS_TABLE_NAME;

  async store(data) {
    try {
      await this.dynamoDb.put({
        TableName: this.TableName,
        Item: data,
      }).promise();
    } catch (err) {
      throw new createHttpError.InternalServerError();
    }
  }

  async get(uuid) {
    let secret;

    try {
      const result = await this.dynamoDb.get({
        TableName: this.TableName,
        Key: { uuid },
      }).promise();

      secret = result.Item;
    } catch (err) {
      console.log(err);
      throw new createHttpError.InternalServerError();
    }

    return secret;
  }

  async update(uuid) {
    let result;

    const params = {
      TableName: this.TableName,
      Key: { uuid },
      UpdateExpression: 'set #v = :views',
      ExpressionAttributeValues: {
        ":views": 1,
      },
      ExpressionAttributeNames: {
        "#v": "views",
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      result = await this.dynamoDb.update(params).promise();
    } catch (err) {
      console.log(err);
      throw new createHttpError.InternalServerError();
    }

    return result.Attributes;
  }

  async destroy(uuid) {
    try {
      await this.dynamoDb.delete({
        TableName: this.TableName,
        Key: { uuid },
      }).promise();
    } catch (err) {
      console.log(err);
      throw new createHttpError.InternalServerError();
    }
  }
}
