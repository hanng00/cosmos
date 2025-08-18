---
id: task-6
title: Brand Voice modal UX and editing
status: To Do
assignee: []
created_date: "2025-08-16"
labels: ["frontend", "ux"]
dependencies: [task-4, task-5]
---

## Goal
Present the analyzed Brand Voice in a modal form for review and edits, then confirm to save as the default Brand Voice.

### Scope
- Modal includes fields: Brand Name, Tone, Audience, Emotion, Character, Syntax, Language (pre-filled from analysis)
- Allow user edits with Zod validation
- Primary CTA: “Save & Create First Reel”
- Secondary CTA: “Continue Later”. This saves the reference in local storage, ensuring the user can return to the flow later. Use zustand to store the reference properly.

### Deliverables
- `web-client/src/features/brands/voice/components/BrandVoiceModal.tsx`
- `web-client/src/features/brands/voice/hooks.ts` (useAnalyzeVoice, useSaveVoice)
- Wiring in `HeroSection` to open the modal

### Acceptance Criteria
- Submitting a URL opens the modal with pre-filled attributes
- Edits validate and save; state persists in query cache or store
- “Generate my first reel” becomes available after save

