import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Brand, BrandSummary } from "../types/domain";
import { getDocClient, getTableName } from "../clients/dynamo";

export class BrandsRepository {
  private tableName = getTableName();
  private doc = getDocClient();

  async getById(brandId: string): Promise<Brand | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `BRAND#${brandId}`, SK: "BRAND" },
      })
    );
    return (res.Item as Brand) || null;
  }

  async listByUser(userId: string, limit = 50): Promise<BrandSummary[]> {
    const res = await this.doc.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
        ExpressionAttributeValues: { ":pk": `USER#${userId}`, ":prefix": "BRAND#" },
        ScanIndexForward: false,
        Limit: limit,
      })
    );
    return (res.Items || []).map((it) => ({
      brandId: it.brandId,
      name: it.name,
      createdAt: it.createdAt,
    }));
  }

  async create(userId: string, name: string): Promise<Brand> {
    const now = new Date().toISOString();
    const brandId = Math.random().toString(36).slice(2, 10);
    const brand: Brand = { brandId, userId, name, createdAt: now, updatedAt: now };
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `BRAND#${brandId}`,
          SK: "BRAND",
          entityType: "BRAND",
          ...brand,
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `USER#${userId}`,
          SK: `BRAND#${now}#${brandId}`,
          entityType: "USER_BRAND",
          brandId,
          userId,
          name,
          createdAt: now,
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );
    return brand;
  }
}


