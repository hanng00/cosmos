import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let cachedDocClient: DynamoDBDocumentClient | null = null;

export function getDocClient(): DynamoDBDocumentClient {
  if (cachedDocClient) return cachedDocClient;
  const ddb = new DynamoDBClient({});
  cachedDocClient = DynamoDBDocumentClient.from(ddb);
  return cachedDocClient;
}

export function getTableName(): string {
  const name = process.env.TABLE_NAME;
  if (!name) throw new Error("TABLE_NAME is not set");
  return name;
}


