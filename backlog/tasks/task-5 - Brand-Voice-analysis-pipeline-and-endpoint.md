---
id: task-5
title: Brand Voice analysis pipeline and endpoint
status: To Do
assignee: []
created_date: "2025-08-16"
labels: ["backend", "llm", "scraper"]
dependencies: [task-3]
---

## Goal
Create a backend endpoint to analyze a website URL and return a structured Brand Voice object (Brand Name, Tone, Audience, Emotion, Character, Syntax, Language, etc.).

### Scope
- `POST /brands/{brandId}/voice/analyze` `{ sourceUrl }` (protected)
- Steps:
  1) Scrape page and extract text (safe fetch, normalization)
  2) LLM prompt to infer voice attributes from text (Zod schema enforced). Use OpenAI Agent SDK (already installed) to orchestrate the steps.
  3) Persist intermediate artifacts with a FK to the Brand in DynamoDB. 
- Return structured voice object and an analysis `voiceAnalysisId`

### Deliverables
- SAM: new Lambda(s) for `brand-voice-analyzer`
- Backend: `src/brands/BrandVoiceAnalyzer.ts`.
- Zod schema for `BrandVoice`

### Acceptance Criteria
- Valid `sourceUrl` returns 200 with a `BrandVoice` object and `voiceAnalysisId`
- Invalid URL → 400
- Errors are surfaced with friendly messages

