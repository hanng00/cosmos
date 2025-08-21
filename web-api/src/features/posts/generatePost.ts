import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { BrandsRepository } from "@/repositories/brandsRepository";

const brandsRepo = new BrandsRepository();

export const lambdaHandler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log("Processing DynamoDB stream event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    try {
      // Only process INSERT events for posts with "generating" status
      if (record.eventName !== "INSERT") {
        continue;
      }

      const newImage = record.dynamodb?.NewImage;
      if (!newImage) {
        console.log("No new image found in record");
        continue;
      }

      // Check if this is a post entity with generating status
      const entityType = newImage.entityType?.S;
      const status = newImage.status?.S;
      
      if (entityType !== "POST" || status !== "generating") {
        console.log(`Skipping record: entityType=${entityType}, status=${status}`);
        continue;
      }

      const postId = newImage.postId?.S;
      const brandId = newImage.brandId?.S;
      const instruction = newImage.instruction?.S;

      if (!postId || !brandId || !instruction) {
        console.error("Missing required fields in post record", {
          postId,
          brandId,
          instruction
        });
        continue;
      }

      console.log(`Starting generation for post ${postId} in brand ${brandId}`);

      // Simulate processing time (15 seconds)
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Complete the post generation
      await brandsRepo.completePostGeneration(brandId, postId, instruction);

      console.log(`Completed generation for post ${postId}`);

    } catch (error) {
      console.error("Error processing stream record:", error);
      // In a production system, you might want to send failed records to a DLQ
    }
  }
};
