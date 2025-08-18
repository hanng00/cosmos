---
id: task-2
title: Protected API basics and `GET /me` endpoint
status: Done
assignee: []
created_date: '2025-08-16'
updated_date: '2025-08-18'
labels: []
dependencies:
  - task-1
---

## Description

## Goal: Expose a protected endpoint to validate Cognito auth and return the current user's profile stub.

### Context
API Gateway default authorizer is Cognito. We need a minimal protected route to verify frontend tokens and unblock subsequent feature work.

### Scope
- Backend `GET /me` protected route that reads the Cognito identity from the request context and returns `{ userId, email }` (email when available)
- Standardized response and error envelope using Zod on the Lambda handler
- Frontend utility to call protected routes with `Authorization` header from the session
- Simple UI indicator in the homepage (or a small `/me` page) to display the current user

### Deliverables
- SAM: new Lambda + route, attached to existing `ApiGatewayApi` with default Cognito authorizer
- Backend: `src/auth/getMe.ts` with strict types and tests
- Frontend: `src/lib/apiClient.ts` (typed fetch with bearer token)
- Frontend: a minimal `src/app/me/page.tsx` that loads and renders the data

### Acceptance Criteria
- Unauthenticated request returns 401 from API Gateway/Cognito
- Authenticated request returns current user info
- Frontend page renders user data when signed in; shows a friendly prompt when signed out
