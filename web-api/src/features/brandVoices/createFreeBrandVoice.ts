import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { z } from "zod";
import { BrandVoicesRepository } from "@/repositories/brandVoicesRepository";

const repo = new BrandVoicesRepository();

const schema = z.object({
  voice: z.object({
    name: z.string().min(1),
    purpose: z.string().min(1),
    audience: z.string().min(1),
    tone: z.array(z.string()).min(1),
    emotion: z.array(z.string()).min(1),
    character: z.array(z.string()).min(1),
    syntax: z.array(z.string()).min(1),
    language: z.array(z.string()).min(1),
  }),
  email: z.string().email().nullable().optional(),
});

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");
    if (!event.body) return { statusCode: 400, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Missing body" }) };
    const parsed = schema.safeParse(JSON.parse(event.body));
    if (!parsed.success) return { statusCode: 400, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: "Invalid body", issues: parsed.error.flatten() }) };
    const { freeVoiceId } = await repo.createFreeBrandVoice(parsed.data.voice, parsed.data.email ?? null);
    return { statusCode: 200, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ freeVoiceId }) };
  } catch (err) {
    return { statusCode: 500, headers: withCors({ "Content-Type": "application/json" }), body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }) };
  }
};


