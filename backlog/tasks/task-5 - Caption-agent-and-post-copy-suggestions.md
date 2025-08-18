---
id: task-5
title: Caption agent and post copy suggestions
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: [task-4]
---

## Goal: Generate short captions and suggested post copy from the summary.

### Context
From the summary, we need concise captions and a short post description matching brand voice.

### Scope
- New Lambda `captioner` that consumes summary JSON and produces captions (3–6) and a short post copy
- Zod schema for captions and copy
- Store results under the job PK

### Deliverables
- `src/pipeline/captioner.ts`
- SAM function + permissions
- Unit tests for schema conformance

### Acceptance Criteria
- For a given summary, returns at least 3 captions and one post copy string

