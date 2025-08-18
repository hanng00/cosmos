---
id: task-4
title: Scraper Lambda and summary agent (LLM)
status: To Do
assignee: []
created_date: "2025-08-16"
labels: []
dependencies: [task-3]
---

## Goal: Implement the first two steps of the pipeline — scrape page HTML and produce a concise summary.

### Context
We need structured content before generating captions/images. Step 1 scrapes HTML, Step 2 runs an LLM to extract key points.

### Scope
- New Lambda `scraper` that fetches HTML safely (timeout, user-agent, basic normalization)
- New Lambda `summarizer` that takes HTML and returns a JSON summary (title, key points, quotes)
- Write intermediate artifacts to DynamoDB under the job PK
- Define schemas with Zod

### Deliverables
- SAM resources for `scraper` and `summarizer` functions
- `src/pipeline/scraper.ts` and `src/pipeline/summarizer.ts`
- Unit tests for parsing/validation

### Acceptance Criteria
- Given a valid URL, scraper stores sanitized HTML snippet/metadata
- Summarizer stores structured summary JSON per schema

