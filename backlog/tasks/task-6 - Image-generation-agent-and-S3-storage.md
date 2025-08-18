---
id: task-6
title: Image generation agent and S3 storage
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: [task-5]
---

## Goal: Generate images from captions and store assets in S3 with signed URL access.

### Context
Produce a small set of images for preview. Start with a single provider (e.g., OpenAI Images).

### Scope
- New Lambda `image-generator` that consumes captions and returns 3–6 images
- Write images to S3 under `jobs/<jobId>/images/<n>.png` and store metadata/thumbnails
- Store signed URL(s) or generate on-demand for the frontend

### Deliverables
- SAM: S3 bucket, IAM permissions, `image-generator` function
- `src/pipeline/imageGenerator.ts`
- Basic rate limiting and error handling

### Acceptance Criteria
- For a given job, at least 3 image objects are written to S3 and metadata is persisted
---
id: task-6
title: Image generation agent and S3 storage
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: ["task-5"]
---

## Goal: Use image APIs to generate frames from captions; write full-size images and thumbnails to S3 with signed URL access and TTL lifecycle.


