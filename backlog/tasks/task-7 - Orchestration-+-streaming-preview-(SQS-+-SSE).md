---
id: task-7
title: Orchestration and streaming preview (SQS + SSE)
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: [task-3, task-4, task-5, task-6]
---

## Goal: Orchestrate pipeline steps and stream partial results to the client.

### Context
We want early perceived speed: stream first captions/images. Use SQS for job fan-out and an SSE endpoint for streaming.

### Scope
- Add SQS queue and a coordinator Lambda that advances job status across steps
- SSE `GET /jobs/{jobId}/events` endpoint that streams updates (`queued`, `scraped`, `summarized`, `first_frame`, `completed`)
- Frontend: generating page connects to SSE and updates UI with thumbnails and captions as they arrive

### Deliverables
- SAM: SQS queue, coordinator, SSE Lambda/API route
- Backend: event schema and coordinator logic
- Frontend: `src/app/generate/[jobId]/page.tsx` streaming UI

### Acceptance Criteria
- Submitting a URL results in visible streaming events on the generating page
- First frame event appears before completion

