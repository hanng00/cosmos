import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { z } from "zod";
import { BrandVoice } from "@/types/domain";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient, getTableName } from "@/clients/dynamo";
import { getUserFromEvent } from "../auth";

const brandsRepo = new BrandsRepository();
const doc = getDocClient();
const tableName = getTableName();

const brandVoiceSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  audience: z.string().min(1),
  tone: z.array(z.string()).min(1),
  emotion: z.array(z.string()).min(1),
  character: z.array(z.string()).min(1),
  syntax: z.array(z.string()).min(1),
  language: z.array(z.string()).min(1),
});

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const brandId = event.pathParameters?.brandId;
    if (!brandId) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing brandId in path" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const parse = brandVoiceSchema.safeParse(JSON.parse(event.body));
    if (!parse.success) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          message: "Invalid body",
          issues: parse.error.flatten(),
        }),
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

    const brandItem = await brandsRepo.getById(brandId);
    if (!brandItem || (user.userId && brandItem.userId !== user.userId)) {
      return {
        statusCode: 403,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Forbidden" }),
      };
    }

    const voice: BrandVoice = parse.data;
    const now = new Date().toISOString();

    // Save under brand partition
    await doc.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          PK: `BRAND#${brandId}`,
          SK: `VOICE`,
          entityType: "BRAND_VOICE",
          brandId,
          ...voice,
          createdAt: brandItem.updatedAt || now,
          updatedAt: now,
        },
      })
    );

    // Optionally store snapshot on brand item
    await doc.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          PK: `BRAND#${brandId}`,
          SK: "BRAND",
          entityType: "BRAND",
          ...brandItem,
          voiceSnapshot: voice,
          updatedAt: now,
        },
      })
    );

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(voice),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        message: (err as Error).message || "Internal Server Error",
      }),
    };
  }
};
