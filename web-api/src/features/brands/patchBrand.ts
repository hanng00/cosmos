import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { getUserFromEvent } from "@/features/auth";
import { z } from "zod";

const brandsRepo = new BrandsRepository();

const schema = z.object({ name: z.string().min(1).max(200) }).partial();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");

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

    if (!event.body) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const parse = schema.safeParse(JSON.parse(event.body));
    if (!parse.success) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Invalid body", issues: parse.error.flatten() }),
      };
    }

    let updated = brand;
    if (parse.data.name) {
      updated = await brandsRepo.updateName(brand, parse.data.name);
    }

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(updated),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};


