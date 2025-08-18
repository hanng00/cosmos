---
id: task-3
title: Brand-scoped URL submit and job kickoff
status: Done
assignee: []
created_date: '2025-08-16'
updated_date: '2025-08-18'
labels: []
dependencies:
  - task-2
---

## Description

## Goal: Allow the UI to submit a source URL for a specific Brand and enqueue a generation Job.

### Context
Brands are the root entity. A Job is created under a Brand from a given `sourceUrl`. This task provides `POST /brands/{brandId}/generate` that validates input, writes a brand-scoped Job record, and returns a `jobId`.

### Scope
- Backend `POST /brands/{brandId}/generate` with Zod body validation: `{ sourceUrl: string }`
- AuthZ: verify the authenticated user owns `brandId` (403 otherwise)
- Write a Job item to DynamoDB with status `queued` and brand-scoped keys:
  - PK = `BRAND#<brandId>`, SK = `JOB#<createdAt>#<jobId>`
  - Attributes: `jobId`, `brandId`, `userId`, `sourceUrl`, `status`, timestamps
- Response: `{ jobId, brandId }`
- Frontend: update submit flow to include an optional `brandId`. If `brandId` is empty, the backend creates a new one and navigate to `app/brands/[brandId]/generate/[jobId]`

### Deliverables
- Backend handler (e.g., `src/brands/postGenerate.ts`) and SAM route `POST /brands/{brandId}/generate`. Good code separating data access with repos, and services for logic. No over-engineering, but good code practices.
- Table key convention documented code comments for brand-scoped items
- Frontend `src/app/brands/[brandId]/generate/[jobId]/page.tsx` skeleton with loading UI

### Acceptance Criteria
- Valid `sourceUrl` returns 200 with a non-empty `jobId` and echoes `brandId`
- Invalid body returns 400 with error details
- 403 when the user does not own `brandId`
- The Job item is persisted under the Brand PK with `queued` status
