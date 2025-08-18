---
id: task-1
title: Connect frontend with backend auth (Cognito)
status: Done
assignee: []
created_date: '2025-08-16'
updated_date: '2025-08-18'
labels: []
dependencies: []
---

## Description

## Goal: Enable sign-in/sign-up from the Next.js app using the existing Cognito User Pool, and use the session to call protected API routes.

### Context
Backend already provisions `CognitoUserPool` and `CognitoUserPoolClient` and configures API Gateway default authorizer. Frontend currently has no auth integration.

### Scope
- Frontend auth integration (email/password and session handling)
- Minimal auth UI (sign in, sign up, sign out)
- Token storage and Authorization header on API fetches
- Local env wiring for User Pool/Client IDs and API base URL

### Deliverables
- `.env.local` variables: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`, `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`, optional `NEXT_PUBLIC_COGNITO_REGION`
- `web-client/src/app/(auth)/sign-in/page.tsx` and `sign-up/page.tsx` with forms (Zod validated)
- Lightweight auth client util (Cognito Hosted UI or SRP via AWS Cognito JS) and session provider
- Example protected fetch from frontend to a test protected route
- README snippet describing how to run end-to-end

### Acceptance Criteria
- User can sign up and sign in via UI; session persists across refresh
- Calls to protected API routes include `Authorization: Bearer <idToken>` and succeed
- Sign out clears session
- Lint passes; types are strict; no console errors in dev

### Notes
- Prefer a minimal client using Cognito Hosted UI first; SRP-based flow acceptable if simpler for local dev.
- Keep components small and colocate auth utilities with the feature folder.
