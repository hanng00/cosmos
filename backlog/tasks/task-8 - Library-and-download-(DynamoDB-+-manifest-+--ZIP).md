---
id: task-8
title: Library and download (DynamoDB + manifest + ZIP)
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: [task-6, task-7]
---

## Goal: Persist completed jobs to a user library and enable download as ZIP with a JSON manifest.

### Context
Users should save, revisit, and download their generated assets.

### Scope
- DynamoDB persistence for completed jobs linked to userId
- Manifest JSON (captions, asset paths, metadata)
- Backend `GET /library` (paginated) and `GET /jobs/{jobId}/download` to create a ZIP on the fly with manifest + images
- Frontend library page with card grid; download button per item

### Deliverables
- Backend: `src/library/getLibrary.ts`, `src/jobs/getDownload.ts`
- Frontend: `src/app/library/page.tsx`
- IAM for S3 read (zip streaming)

### Acceptance Criteria
- Completed jobs appear in `GET /library` for the authenticated user
- Download returns a ZIP with images and manifest.json

