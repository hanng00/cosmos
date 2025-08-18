import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "../utils/cors";
import { BrandsRepository } from "../repositories/brandsRepository";

const brandsRepo = new BrandsRepository();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");

    const authorizer = (event.requestContext as any)?.authorizer ?? null;
    const claims = (authorizer && (authorizer as any).claims) || null;
    const userId: string | null = (claims && claims.sub) || (authorizer && (authorizer as any).principalId) || null;
    if (!userId) {
      return {
        statusCode: 401,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    const name = "My Brand";
    const brand = await brandsRepo.create(userId, name);
    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ brandId: brand.brandId, name: brand.name }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};


