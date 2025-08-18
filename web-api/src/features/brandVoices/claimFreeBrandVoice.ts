import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { z } from "zod";
import { BrandVoicesRepository } from "@/repositories/brandVoicesRepository";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { getUserFromEvent } from "@/features/auth";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient, getTableName } from "@/clients/dynamo";

const repo = new BrandVoicesRepository();
const brands = new BrandsRepository();
const doc = getDocClient();
const tableName = getTableName();

const schema = z.object({ freeVoiceId: z.string().min(1) });

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = getUserFromEvent(event);
    if (!user) return { statusCode: 401, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Unauthorized" }) };
    if (!event.body) return { statusCode: 400, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Missing body" }) };
    const parsed = schema.safeParse(JSON.parse(event.body));
    if (!parsed.success) return { statusCode: 400, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Invalid body", issues: parsed.error.flatten() }) };

    const free = await repo.getFreeBrandVoice(parsed.data.freeVoiceId);
    if (!free) return { statusCode: 404, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Not found" }) };

    const brand = await brands.create(user.userId, free.voice.name || "My Brand");

    await doc.send(new PutCommand({
      TableName: tableName,
      Item: {
        PK: `BRAND#${brand.brandId}`,
        SK: `VOICE`,
        entityType: "BRAND_VOICE",
        brandId: brand.brandId,
        ...free.voice,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      },
    }));

    return { statusCode: 200, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ brandId: brand.brandId }) };
  } catch (err) {
    return { statusCode: 500, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }) };
  }
};


