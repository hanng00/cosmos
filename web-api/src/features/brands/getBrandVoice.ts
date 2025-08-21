import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient, getTableName } from "@/clients/dynamo";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { getUserFromEvent } from "@/features/auth";

const doc = getDocClient();
const tableName = getTableName();
const brandsRepo = new BrandsRepository();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const envTable = process.env.TABLE_NAME;
    if (!envTable) throw new Error("TABLE_NAME is not set");

    const brandId = event.pathParameters?.brandId;
    if (!brandId) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing brandId in path" }),
      };
    }

    const user = getUserFromEvent(event);
    if (!user) {
      return {
        statusCode: 401,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const brand = await brandsRepo.getById(brandId);
    if (!brand || brand.userId !== user.userId) {
      return {
        statusCode: 404,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Brand not found" }),
      };
    }

    const res = await doc.send(
      new GetCommand({
        TableName: tableName,
        Key: { PK: `BRAND#${brandId}`, SK: "VOICE" },
      })
    );
    if (!res.Item) {
      return {
        statusCode: 404,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "No saved voice for this brand" }),
      };
    }

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(res.Item),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};


