import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { BrandVoicesRepository } from "@/repositories/brandVoicesRepository";

const repo = new BrandVoicesRepository();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");

    const analysisId = event.pathParameters?.analysisId;
    if (!analysisId) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing analysisId in path" }),
      };
    }

    const job = await repo.getAnalysisJob(analysisId);
    if (!job) {
      return {
        statusCode: 404,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(job),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};


