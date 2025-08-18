import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Job } from "../types/domain";
import { getDocClient, getTableName } from "./dynamo";

export class JobsRepository {
  private tableName = getTableName();
  private doc = getDocClient();

  async createQueuedJob(args: {
    brandId: string;
    userId: string;
    sourceUrl: string;
  }): Promise<Job> {
    const now = new Date().toISOString();
    const jobId = Math.random().toString(36).slice(2, 10);
    const job: Job = {
      jobId,
      brandId: args.brandId,
      userId: args.userId,
      sourceUrl: args.sourceUrl,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    };
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `BRAND#${args.brandId}`,
          SK: `JOB#${now}#${jobId}`,
          entityType: "JOB",
          ...job,
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );
    return job;
  }
}


