---
id: task-7
title: Save Brand Voice and attach to Brand
status: To Do
assignee: []
created_date: '2025-08-16'
updated_date: '2025-08-18'
labels:
  - backend
  - frontend
dependencies:
  - task-5
  - task-6
---

## Description

## Goal
Persist the edited Brand Voice as the Brand’s default configuration.

### Scope
- Backend `PUT /brands/{brandId}/voice` to save `BrandVoice` (protected)
- Dynamo: store voice under `PK=BRAND#<brandId>`, `SK=VOICE` and include snapshot in brand metadata if useful
- Frontend: `useSaveVoice` mutation to persist and update cache

### Deliverables
- Backend handler `src/brands/PutBrandVoice.ts`
- Zod schema (shared types) for `BrandVoice`
- Frontend hook wired in modal

### Acceptance Criteria
- Saving persists the voice and returns the saved object
- Subsequent reads of the Brand show the saved voice
