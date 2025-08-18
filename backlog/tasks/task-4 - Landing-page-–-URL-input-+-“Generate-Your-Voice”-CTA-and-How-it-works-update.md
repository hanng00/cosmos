---
id: task-4
title: Landing page – URL input + “Generate Your Voice” CTA and How it works update
status: Done
assignee: []
created_date: '2025-08-16'
updated_date: '2025-08-18'
labels:
  - frontend
  - ux
  - copy
dependencies:
  - task-1
  - task-2
  - task-3
---

## Description

## Goal
Change the primary CTA on the landing page to “Generate Your Voice”, wire it to start the brand voice flow, and update the “How it works” section with the new copy.

### Scope
- Update Hero input to accept a URL and trigger the new brand-voice modal flow (no direct reel generation yet)
- Update “How it works” content to:
  1) Enter your website (scan text and analyze how you write)
  2) Fine Tune Your Voice (edit tone, style, audience, etc.)
  3) Save & Create Content (sign up for free trial; AI creates social media, emails, blogs, etc.)
- Keep co-location: implement under the Brand feature at `web-client/src/features/brands/voice/`

### Deliverables
- `web-client/src/features/brands/voice/` created (placeholder modal entry point and hooks surface)
- `HeroSection` triggers the brand voice modal via a feature hook
- “How it works” section copy updated to supplied text

### Acceptance Criteria
- Landing page shows the new CTA “Generate Your Voice”
- Submitting a URL opens the brand voice modal rather than starting reel generation. The voice modal should have a title "Generating Your Brand Voice", with the URL and text-copy in active form.
- Updated “How it works” copy renders correctly on the page
