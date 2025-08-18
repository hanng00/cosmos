# Cosmos — Product Specification

*Your steady point in the social tide.*

---

# Why

Brands and creators live or die by their ability to stay visible and relevant, but creating short, polished social content is expensive and slow. Most teams lack the time and motion/design skills to repeatedly turn articles and pages into on-brand visuals. Cosmos solves this by centering the workflow on the Brand: users create a Brand (voice, style, presets) once, then generate consistently on-brand visuals from any source URL in minutes. We optimize for quick, credible wins and a reusable brand library so creators publish better, faster, and stay consistent across posts and campaigns.

# How

Cosmos uses LLM-driven agents with a brand-first flow. The user selects or creates a Brand, pastes a URL, and a brand-scoped Job is created. The pipeline scrapes the page, summarizes it, generates brand-aligned captions, and produces images that match the Brand’s style. Assets and metadata are stitched into a coherent sequence stored in S3 under the Brand. The UI follows a single fast path: minimal brand setup, paste a URL, tap **Generate**. We optimize perceived speed with streaming: partial results (first captions/thumbnails) arrive via events so users see progress and an early preview before the full set completes.

# What

Cosmos is a web app that turns a URL into a Brand-scoped content package: a small set of images and matching captions with tools to preview, tweak, save, and download. The MVP delivers: auth and lightweight Brand setup; a one-click Brand → URL → generate flow; LLM-produced captions; model-generated images; a preview and inline caption editor; a Brand library of generated Reels; and exportable image assets. We deliberately exclude — for MVP — direct posting automation, multi-source connectors, and long-form video. The immediate promise: create a Brand once, paste a URL, and get an on-brand visual story in minutes.

---

# Core user journeys

## 1 — First-time user (Time-to-Wow optimized)

1. Landing: single headline and one prominent input: **Paste a URL**.
2. Minimal sign-up: Google OAuth or email/password with one required field (brand name). Logo and colors are optional and editable later.
3. Paste URL and tap **Generate**.
4. Streaming preview begins within 10–30 seconds: first image(s) and top caption appear; progress bar and friendly status text explain what’s happening.
5. Full image set + caption suggestions arrive (target: median ≤ 90–120s).
6. Inline edit: change captions, swap an image (regenerate that frame), reorder frames. Small edits re-run generation for only affected frames (fast).
7. Save to library and **Download** as a ZIP of images + a JSON manifest of captions and suggested post copy.

## 2 — Returning user (engagement & retention)

* Dashboard shows brands, recent reels (image-sets), and one-click **New Reel** input.
* Quick suggestions: “We found 3 new blog posts — make a reel?” (one-click generate per article).
* Library + favorites: reuse styles and saved caption templates.
* Optional: schedule reminders and export manifest for later manual or tool-based posting.

---

# Interaction & UX details (clean, Apple-ish)

## Key principles

* Single main action per screen. No clutter.
* White space, restraint, and clear hierarchy.
* Motion for clarity (not showboating): smooth transitions and subtle micro-animations.
* Outcome-focused CTAs: **Make My Reel**, **Show Me a Preview**, **Save & Download**.

## Screen examples (concept)

* **Landing / Paste URL**: large input, brief 1-line value prop, small “how it works” tooltip.
* **Generating**: centred card with progress steps, streaming thumbnails, and contextual microcopy (“Picking the best lines”, “Generating visuals”).
* **Preview / Edit**: vertical sequence of image cards with caption editor, frame-level regenerate button, and reorder handles.
* **Library**: card grid, filter by brand, quick-generate from saved posts.

## Tone & copy

* Calm, confident, helpful. Example microcopy: “We’ve turned your article into 4 visuals — tweak the captions or download them now.”

---

# Technical architecture (MVP)

## Domain model (Brand hierarchy)

- Brand: owned by a user; holds style presets and settings; root entity for generation and library.
- Source (optional for later): URL or feed connected to a Brand for quick generate.
- Job: brand-scoped generation request created from a `sourceUrl`; streams status events until completion.
- Reel: the saved, consumable output of a completed Job (frames + manifest) under a Brand; appears in the Library.
- Frame: image + caption within a Reel.

## API surface (MVP)

- POST `/brands` → create a Brand for the authenticated user
- GET `/brands` → list Brands for the authenticated user
- POST `/brands/{brandId}/generate` → submit `{ sourceUrl }` to create a brand-scoped Job; returns `{ jobId, brandId }`
- GET `/me` → current authenticated user info

Planned as the pipeline matures:
- GET `/jobs/{jobId}/events` (SSE) → stream status updates and partial results
- GET `/brands/{brandId}/reels` → list Reels for a Brand
- GET `/reels/{reelId}/download` → ZIP with images + manifest

## Data model (DynamoDB, single-table)

- PK `BRAND#<brandId>`, SK `BRAND` → brand metadata
- PK `USER#<userId>`, SK `BRAND#<createdAt>#<brandId>` → pointer items to list brands by user (Query by PK)
- PK `BRAND#<brandId>`, SK `JOB#<createdAt>#<jobId>` → jobs
- PK `BRAND#<brandId>`, SK `REEL#<createdAt>#<reelId>` → reels
- PK `BRAND#<brandId>`, SK `FRAME#<reelId>#<index>` → frames
- (Optional) PK `JOB#<jobId>`, SK `EVENT#<timestamp>` or nested under Brand PK for SSE events

## Assets layout (S3)

- `brands/<brandId>/jobs/<jobId>/images/frame-<n>.png`
- `brands/<brandId>/jobs/<jobId>/thumbs/frame-<n>.jpg`
- `brands/<brandId>/jobs/<jobId>/manifest.json`
- `brands/<brandId>/reels/<reelId>/...` (final assets)

## Frontend

* **Next.js** (App Router + server components)
* TailwindCSS + Shadcn/UI; Framer Motion for subtle interactions
* Client streams partial generation results via WebSocket or server-sent events

## Backend (AWS SAM)

* **API Gateway → Lambda** for API surface
* **Cognito** for auth (Google OAuth + email)
* **DynamoDB** for user, brand, reel metadata and manifest
* **S3** for generated image assets, thumbnails and manifests
* **Step function (or orchestrator Lambda)** to sequence LLM agent steps:

  1. Scraper Lambda fetches page HTML
  2. Summarizer agent (LLM) extracts key points, headlines, quotes
  3. Script/caption agent generates short captions, suggested post copy
  4. Image agent calls OpenAI image APIs (text→image / img→img) to produce frames
  5. Assembly step writes metadata, small thumbnails, and marks completion
* **Queueing** (SQS) for retry/backoff and horizontal scaling of image generation
* **Optional**: lightweight ffmpeg or compositor only if/when we convert to short video in V2

## Security & cost controls

* Rate limits per account, image generation batching, caching of repeated prompts, and quotas to reduce LLM cost exposure.
* Signed S3 URLs for downloads; generate assets TTL-based cleanup policy.

---

# Optimization strategy: Time-to-Wow, Engagement, Retention

## Time-to-Wow (TtW) — goals & tactics

**Target:** users see an attractive preview within 30s and a complete image set within 90–120s (median).
**Tactics:**

* **Instant demo on signup:** generate a canned demo image set the moment a user signs up so they get a visible win before they paste a URL.
* **Progressive streaming:** surface the first good frame(s) and top caption early. Use server-sent events or websockets.
* **One-click default path:** require only brand name for first run; sane defaults for templates and layout.
* **Frame-level regeneration:** when users edit a caption, re-run only that frame instead of re-generating the whole set.
* **Fallback assets:** if image generation is slow, show curated stock placeholders that match brand style while final images render.

## Engagement — how to get frequent meaningful use

**Tactics:**

* **Content suggestions:** scan connected site periodically and surface new posts with one-click generate.
* **Micro-wins & templates:** allow saving brand styles and a “favorite” template; present CTA “Make a Reel like this” on each saved asset.
* **Short friction loops:** quick edit → preview → download flows that take <60s.
* **Team affordances:** comments/notes per image frame for small teams (later).

## Retention — convert repeat use into habit

**Tactics:**

* **Milestones and small gamification:** celebrate “First Reel,” “3 Reels,” etc., with lightweight badges and email nudges.
* **Scheduled reminders:** weekly digest: “You posted 2 weeks ago — make a new reel from your latest post?”
* **Evidence of ROI:** allow users to paste published post links and attach basic engagement metrics (manual input or later integration), reinforcing perceived value.
* **Progressive value gating:** give generous free trial access; add soft gating to encourage upgrade only after the user experiences repeated wins.

---

# Instrumentation & metrics (events to track)

* `account_created`
* `brand_created`
* `demo_reel_generated`
* `url_submitted`
* `generate_started` (props: source\_url)
* `first_frame_streamed` (timestamp)
* `generate_completed` (props: frames\_count, total\_time\_s)
* `frame_regenerated`
* `caption_edited`
* `asset_downloaded`
* `email_nudge_sent` / `nudge_clicked`

**Key KPIs**

* Median **Time-to-first-frame** and **Time-to-complete**
* Activation (%) = accounts that generate at least one real reel in first session
* DAU/MAU and reels\_per\_active\_user\_per\_week
* D1/D7/D30 retention cohorts
