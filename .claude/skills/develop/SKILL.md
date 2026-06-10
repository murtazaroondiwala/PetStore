---
name: develop
description: Structured development workflow — gathers requirements, builds a layered plan across backend and frontend, executes iteratively with summaries, and handles post-steps like type regeneration.
---

# Development Workflow Skill

When this skill is invoked, follow this structured workflow. Do NOT skip steps or combine them.

## Phase 1: Gather Requirements

**Step 1** — Ask the user for a high-level description of the feature or change:
- "What feature or change do you want to implement? Describe it in a sentence or two."

**Step 2** — Based on the description, analyze which layers will be affected and ask the user to confirm or adjust. Ask using a multi-select question with these options:

- **Models/Enums** — New or modified domain models in `PetStore.Api/Models/`
- **DTOs** — New or modified DTOs in `PetStore.Api/DTOs/` (triggers type regeneration)
- **Repository layer** — Changes to data access in `PetStore.Api/Repositories/`
- **Service layer** — Business logic changes in `PetStore.Api/Services/`
- **Controllers** — New or modified API endpoints in `PetStore.Api/Controllers/`
- **Frontend** — React components, hooks, context, or API calls in `petstore-web/src/`

For each selected layer, ask a brief follow-up about what specifically changes (e.g., "What fields are you adding to the model?" or "What new endpoint do you need?"). Keep follow-ups short — one question per layer, not a deep interview.

## Phase 2: Build the Plan

Enter plan mode and create a step-by-step implementation plan. Order the steps following the dependency chain:

1. Models/Enums (if applicable)
2. DTOs (if applicable)
3. Repository interfaces + implementations (if applicable)
4. Service interfaces + implementations (if applicable)
5. Controller endpoints (if applicable)
6. **Backend verification** — build the backend (`dotnet build`), run tests (`dotnet test`)
7. **Type regeneration** — if any DTOs were changed: remind the user to restart the backend, then run `npm run generate-api-types` in `petstore-web/`
8. Frontend API layer (`api/` files) (if applicable)
9. Frontend hooks/context (if applicable)
10. Frontend components (if applicable)
11. **Frontend verification** — type-check (`npx tsc --noEmit`), run tests (`npx vitest run`)
12. Backend tests — add or update tests in `PetStore.Api.Tests/` for new/changed logic
13. Frontend tests — add or update tests in `petstore-web/src/tests/` if needed

Present the plan to the user for approval before proceeding.

## Phase 3: Execute Iteratively

Execute each plan step one at a time. After completing each step:

1. Mark the task as completed
2. Print a short summary (2-3 lines max) of what was done in that step
3. If any issues were encountered, explain them before moving to the next step

## Phase 4: Post-Implementation

After all steps are complete, print a final summary:

- List all files created or modified
- List any commands the user needs to run (e.g., restart backend, restart frontend dev server)
- Note any manual testing the user should do

## Important Rules

- Follow the TypeScript constraints from CLAUDE.md: use `import type` for interfaces, no constructor parameter properties
- When adding DTOs, always add `[Required]` attributes so generated types are non-optional
- When adding new service/repository interfaces, register them in `Program.cs` DI container
- All API responses must use the `ApiResponse<T>` envelope
- Frontend API calls go through `apiClient.ts`, not raw `fetch`
- If the user says "skip" for any step, skip it without asking again
