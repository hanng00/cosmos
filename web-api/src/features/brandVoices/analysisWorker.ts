import { DynamoDBStreamEvent } from "aws-lambda";
import { BrandVoicesRepository } from "@/repositories/brandVoicesRepository";
import { BrandVoice } from "@/types/domain";

const repo = new BrandVoicesRepository();

export const lambdaHandler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (record.eventName !== "INSERT") continue;
    const newImage = record.dynamodb?.NewImage;
    if (!newImage) continue;
    const pk = newImage.PK?.S || "";
    const sk = newImage.SK?.S || "";
    const entityType = newImage.entityType?.S || "";
    if (
      !pk.startsWith("BRANDVOICE#") ||
      sk !== "UNASSIGNED" ||
      entityType !== "BRAND_VOICE_ANALYSIS"
    )
      continue;

    const analysisId = newImage.analysisId?.S || pk.replace("BRANDVOICE#", "");
    const sourceUrl = newImage.sourceUrl?.S || "";

    const hostname = sourceUrl
      ? new URL(sourceUrl).hostname.replace(/^www\./, "")
      : "example";
    const brandBase = hostname.split(".")[0] || "brand";
    const voice: BrandVoice = {
      name: brandBase.charAt(0).toUpperCase() + brandBase.slice(1),
      purpose: "Create short-form content to explain our product clearly",
      audience: "Prospective customers interested in modern software",
      tone: ["Confident", "Friendly"],
      emotion: ["Optimistic"],
      character: ["Pragmatic expert"],
      syntax: ["Short sentences", "Active voice"],
      language: ["English"],
    };

    await repo.completeAnalysisJob(analysisId, voice);
  }
};
