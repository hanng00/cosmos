import { APIGatewayProxyEvent } from "aws-lambda";

type CognitoClaims = {
  sub?: string;
  email?: string;
  [key: string]: unknown;
};

type User = {
  userId: string;
  email: string | null;
};

/**
 * Returns the user ID and email from the event.
 * Returns null if the user is not authenticated.
 */
export const getUserFromEvent = (event: APIGatewayProxyEvent): User | null => {
  const authorizer = (event.requestContext as any)?.authorizer ?? null;
  const claims: CognitoClaims | null =
    (authorizer && (authorizer as any).claims) || null;
  const userId: string | null =
    (claims && claims.sub) ||
    (authorizer && (authorizer as any).principalId) ||
    null;
  if (!userId) return null;
  const email: string | null = (claims && (claims.email ?? null)) || null;

  return { userId, email };
};
