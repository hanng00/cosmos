import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getDocClient, getTableName } from "@/clients/dynamo";
import { BrandVoice } from "@/types/domain";

export type BrandVoiceAnalysisStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface BrandVoiceAnalysis {
  analysisId: string;
  sourceUrl: string;
  writingSample?: string;
  status: BrandVoiceAnalysisStatus;
  voice?: BrandVoice;
  createdAt: string;
  updatedAt: string;
}

export class BrandVoicesRepository {
  private tableName = getTableName();
  private doc = getDocClient();

  async createAnalysisJob(args: { sourceUrl: string; writingSample?: string }): Promise<BrandVoiceAnalysis> {
    const now = new Date().toISOString();
    const analysisId = Math.random().toString(36).slice(2, 10);
    const item = {
      PK: `BRANDVOICE#${analysisId}`,
      SK: "UNASSIGNED",
      entityType: "BRAND_VOICE_ANALYSIS",
      analysisId,
      sourceUrl: args.sourceUrl,
      writingSample: args.writingSample,
      status: "IN_PROGRESS" as BrandVoiceAnalysisStatus,
      createdAt: now,
      updatedAt: now,
    };
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );
    const { writingSample, ...rest } = item;
    return rest as unknown as BrandVoiceAnalysis;
  }

  async getAnalysisJob(analysisId: string): Promise<BrandVoiceAnalysis | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `BRANDVOICE#${analysisId}`, SK: "UNASSIGNED" },
      })
    );
    return (res.Item as BrandVoiceAnalysis) || null;
  }

  async completeAnalysisJob(analysisId: string, voice: BrandVoice): Promise<void> {
    const now = new Date().toISOString();
    await this.doc.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { PK: `BRANDVOICE#${analysisId}`, SK: "UNASSIGNED" },
        UpdateExpression: "SET #s = :s, #v = :v, updatedAt = :u",
        ExpressionAttributeNames: { "#s": "status", "#v": "voice" },
        ExpressionAttributeValues: { ":s": "COMPLETED", ":v": voice, ":u": now },
      })
    );
  }

  async createFreeBrandVoice(voice: BrandVoice, email: string | null, sourceUrl?: string): Promise<{ freeVoiceId: string }> {
    const now = new Date().toISOString();
    const freeVoiceId = Math.random().toString(36).slice(2, 10);
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `FREEVOICE#${freeVoiceId}`,
          SK: "FREEVOICE",
          entityType: "FREE_BRAND_VOICE",
          freeVoiceId,
          email,
          voice,
          sourceUrl,
          createdAt: now,
          updatedAt: now,
        },
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );
    return { freeVoiceId };
  }

  async getFreeBrandVoice(freeVoiceId: string): Promise<{ voice: BrandVoice; email: string | null; sourceUrl?: string } | null> {
    const res = await this.doc.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { PK: `FREEVOICE#${freeVoiceId}`, SK: "FREEVOICE" },
      })
    );
    if (!res.Item) return null;
    return { 
      voice: (res.Item as any).voice as BrandVoice, 
      email: (res.Item as any).email ?? null,
      sourceUrl: (res.Item as any).sourceUrl
    };
  }
}


