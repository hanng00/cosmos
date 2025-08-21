import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { Brand, BrandSummary, Post } from "../types/domain";
import { getDocClient, getTableName } from "../clients/dynamo";
import { QueryCommand as DdbQueryCommand } from "@aws-sdk/lib-dynamodb";

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

  async updateName(brand: Brand, newName: string): Promise<Brand> {
    const now = new Date().toISOString();
    const updated: Brand = { ...brand, name: newName, updatedAt: now };

    // Update the brand item
    await this.doc.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: `BRAND#${brand.brandId}`, SK: "BRAND" },
        UpdateExpression: "SET #n = :n, updatedAt = :u",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: { ":n": newName, ":u": now },
      })
    );

    // Update the user pointer item so list results reflect the new name
    await this.doc.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: `USER#${brand.userId}`, SK: `BRAND#${brand.createdAt}#${brand.brandId}` },
        UpdateExpression: "SET #n = :n",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: { ":n": newName },
      })
    );

    return updated;
  }

  async listPosts(brandId: string, limit = 50): Promise<Post[]> {
    const res = await this.doc.send(
      new DdbQueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
        ExpressionAttributeValues: { ":pk": `BRAND#${brandId}`, ":prefix": "POST#" },
        ScanIndexForward: false,
        Limit: limit,
      })
    );
    return (res.Items || []).map((it) => ({
      postId: (it as any).postId as string,
      brandId: brandId,
      title: (it as any).title as string,
      excerpt: (it as any).excerpt as string | undefined,
      thumbnailUrl: (it as any).thumbnailUrl as string | undefined,
      status: ((it as any).status as any) ?? "generated",
      createdAt: (it as any).createdAt as string,
      updatedAt: (it as any).updatedAt as string,
    }));
  }
}


