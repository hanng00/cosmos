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

    // Use the brand voice name, or derive from sourceUrl if available
    let brandName = free.voice.name;
    if (!brandName && free.sourceUrl) {
      try {
        const hostname = new URL(free.sourceUrl).hostname.replace(/^www\./, '');
        const brandBase = hostname.split('.')[0] || 'brand';
        brandName = brandBase.charAt(0).toUpperCase() + brandBase.slice(1);
      } catch {
        brandName = "My Brand";
      }
    }
    const brand = await brands.create(user.userId, brandName || "My Brand");

    // Store the brand voice as a separate record
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

    // Update the brand record to include the voice snapshot for quick reads
    await doc.send(new PutCommand({
      TableName: tableName,
      Item: {
        ...brand,
        PK: `BRAND#${brand.brandId}`,
        SK: `BRAND`,
        entityType: "BRAND",
        voiceSnapshot: free.voice,
      },
    }));

    return { statusCode: 200, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ brandId: brand.brandId }) };
  } catch (err) {
    return { statusCode: 500, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }) };
  }
};


