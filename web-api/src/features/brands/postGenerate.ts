import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { z } from "zod";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { JobsRepository } from "@/repositories/jobsRepository";
import { getUserFromEvent } from "@/features/auth";

const requestSchema = z.object({ sourceUrl: z.string().url() });

const brandsRepo = new BrandsRepository();
const jobsRepo = new JobsRepository();

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

    if (!event.body) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing request body" }),
      };
    }

    const parse = requestSchema.safeParse(JSON.parse(event.body));
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

    const { sourceUrl } = parse.data;
    const user = getUserFromEvent(event);
    if (!user) {
      return {
        statusCode: 401,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }

    // AuthZ: check brand ownership (PK=BRAND#brandId, SK=BRAND) with userId
    const brandItem = await brandsRepo.getById(brandId);
    if (!brandItem || (user.userId && brandItem.userId !== user.userId)) {
      return {
        statusCode: 403,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Forbidden" }),
      };
    }

    const job = await jobsRepo.createQueuedJob({
      brandId,
      userId: user.userId,
      sourceUrl,
    });

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ jobId: job.jobId, brandId }),
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
