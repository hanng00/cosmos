import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "@/utils/cors";
import { BrandsRepository } from "@/repositories/brandsRepository";
import { getUserFromEvent } from "@/features/auth";

const brandsRepo = new BrandsRepository();

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.TABLE_NAME;
    if (!tableName) throw new Error("TABLE_NAME is not set");

    const brandId = event.pathParameters?.brandId;
    const postId = event.pathParameters?.postId;
    
    if (!brandId || !postId) {
      return {
        statusCode: 400,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Missing brandId or postId in path" }),
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

    const post = await brandsRepo.getPostById(brandId, postId);
    if (!post) {
      return {
        statusCode: 404,
        headers: withCors({ "Content-Type": "application/json" }),
        body: JSON.stringify({ message: "Post not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify(post),
    };
  } catch (err) {
    console.error("Error fetching post:", err);
    return {
      statusCode: 500,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: (err as Error).message || "Internal Server Error" }),
    };
  }
};
