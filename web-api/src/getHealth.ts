import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { withCors } from "./utils/cors";

export const lambdaHandler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: withCors({ "Content-Type": "application/json" }),
    body: JSON.stringify({ ok: true }),
  };
};
