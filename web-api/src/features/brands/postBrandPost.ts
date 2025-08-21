import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { getUserFromEvent } from "@/features/auth";

const brandsRepo = new BrandsRepository();

interface CreatePostRequest {
  instruction: string;
}

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

    // Verify brand ownership
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

    const request: CreatePostRequest = JSON.parse(event.body);

    // Validate required fields
    if (!request.instruction) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ 
          message: "Missing required field: instruction is required" 
        }),
      };
    }

    if (request.instruction.trim().length < 10) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ 
          message: "Instruction must be at least 10 characters long" 
        }),
      };
    }

    const post = await brandsRepo.createPost(
      user.userId,
      brandId,
      request.instruction
    );

    return {
      statusCode: 201,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(post),
    };
  } catch (err) {
    console.error("Error creating post:", err);
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};
