export { lambdaHandler } from "./getMe";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "../utils/cors";

type CognitoClaims = {
  sub?: string;
  email?: string;
  [key: string]: unknown;
};

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorizer = (event.requestContext as any)?.authorizer ?? null;
  const claims: CognitoClaims | null = (authorizer && (authorizer as any).claims) || null;
  const userId: string | null = (claims && claims.sub) || (authorizer && (authorizer as any).principalId) || null;
  const email: string | null = (claims && (claims.email ?? null)) || null;

  if (!userId) {
    return {
      statusCode: 401,
      headers: withCors({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  return {
    statusCode: 200,
    headers: withCors({ "Content-Type": "application/json" }),
    body: JSON.stringify({ userId, email }),
  };
};


