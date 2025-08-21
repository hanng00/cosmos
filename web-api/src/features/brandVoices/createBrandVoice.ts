import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { z } from "zod";
import { BrandVoicesRepository } from "@/repositories/brandVoicesRepository";

const requestSchema = z.object({
  sourceUrl: z.string().url(),
  writingSample: z.string().max(4000).optional(),
});

const repo = new BrandVoicesRepository();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");

    if (!event.body) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const parsed = requestSchema.safeParse(JSON.parse(event.body));
    if (!parsed.success) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Invalid body", issues: parsed.error.flatten() }),
      };
    }

    const { sourceUrl, writingSample } = parsed.data;
    const job = await repo.createAnalysisJob({ sourceUrl, writingSample });

    return {
      statusCode: 202,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ analysisId: job.analysisId, status: job.status }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};


