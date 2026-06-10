---
name: grill-me
description: Interactive deep-dive questioning session — grills the user on a feature's design, edge cases, and architecture until both sides agree, then produces a TDD plan with an architecture diagram.
---

# Grill Me Skill

When this skill is invoked, follow this structured workflow. Do NOT skip phases or rush to planning.

## Phase 1: What Are You Building?

**Step 1** — Ask the user for a one-liner describing the feature or functionality they want to build:
- "What are you building? Give me the elevator pitch in one or two sentences."

**Step 2** — Once they respond, acknowledge what you heard and immediately begin grilling.

## Phase 2: The Grill (Iterative Questioning)

This is the core of the skill. Your job is to act as a **tough but constructive interviewer** — like a senior architect doing a design review. Challenge assumptions, surface edge cases, and force the user to think through their design.

### How to grill

- Ask **2–3 focused questions per round** (never more than 3). Use the AskUserQuestion tool when options make sense, or ask open-ended questions as plain text when the question needs a free-form answer.
- Questions should progress through these categories (not necessarily in strict order — follow the conversation):

  1. **Clarification** — What exactly does this do? What doesn't it do? What's the scope boundary?
  2. **Data & State** — What data is involved? What's the shape? Where does it live? What's mutable vs immutable?
  3. **Behavior & Flow** — What triggers this? What's the happy path? What does the user see/experience step by step?
  4. **Edge Cases & Errors** — What happens when things go wrong? Empty state? Concurrent access? Invalid input? Partial failure?
  5. **Integration** — How does this interact with existing features? Does it change any current behavior? Any breaking changes?
  6. **API Design** — What endpoints/contracts are needed? Request/response shapes? Status codes?
  7. **Frontend UX** — What does the user see? Loading states? Optimistic updates? Error display?

### Grill rules

- **Be direct.** Don't soften questions with filler. "What happens if the cart is empty when checkout is called?" not "I was just wondering, if you don't mind me asking..."
- **Challenge weak answers.** If the user says "it just works" or gives a vague answer, push back: "How specifically? Walk me through the exact flow."
- **Build on prior answers.** Each round should deepen understanding, not repeat ground already covered.
- **Acknowledge good answers.** When the user gives a solid answer, say so briefly and move on.
- **Track what's resolved vs open.** Mentally keep a list of decided vs undecided design points.
- **Read the existing codebase** as needed to ask informed questions. Reference actual file names, patterns, and conventions from the project when relevant.
- **Stop when ready.** After enough rounds (typically 3–6), when you have a clear picture of the feature — data model, behavior, edge cases, API contract, and UI — propose moving to Phase 3. Ask: "I think I have a solid picture. Ready to lock this down and build the plan, or is there anything else you want to hash out?"

## Phase 3: Architecture Diagram

Before writing the plan, produce an **ASCII architecture diagram** showing how the feature fits into the existing system. The diagram should show:

- Components involved (models, services, repositories, controllers, frontend components)
- Data flow direction (arrows showing request/response flow)
- New components vs existing ones (mark new ones clearly)
- Integration points with the existing system

Present the diagram and ask the user to confirm it matches their mental model. Adjust if needed.

Example format:
```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│                                                         │
│  [CartSidebar] ──→ [useCart()] ──→ [apiClient.ts]       │
│       │                                    │            │
│       ▼                                    │            │
│  [CheckoutButton] ◄── NEW                 │            │
└───────────────────────────────────────────│────────────┘
                                            │ POST /api/checkout
                                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Backend                            │
│                                                         │
│  [CheckoutController] ◄── NEW                          │
│       │                                                 │
│       ▼                                                 │
│  [ICheckoutService] ──→ [CheckoutService] ◄── NEW      │
│       │                        │                        │
│       ▼                        ▼                        │
│  [ICartRepository]    [IOrderRepository] ◄── NEW       │
│       │                        │                        │
│       ▼                        ▼                        │
│  [CartRepository]     [OrderRepository] ◄── NEW        │
└─────────────────────────────────────────────────────────┘
```

## Phase 4: TDD Implementation Plan

Enter plan mode and create a **test-driven development plan**. The key difference from a regular plan: **tests come FIRST in each layer, before the implementation.**

For each affected layer, the plan should follow this pattern:

1. **Write the failing test(s)** — Define what the code should do before writing it
2. **Write the minimal implementation** — Just enough to make the tests pass
3. **Refactor if needed** — Clean up while keeping tests green

### Plan structure

Order steps by dependency chain, but within each layer, tests precede implementation:

1. **Models/Enums** (if applicable)
   - Define the model/enum (tests not typically needed for pure data classes)

2. **Repository layer** (if applicable)
   - Write repository interface
   - Write repository tests (expected behavior for add, get, edge cases)
   - Implement repository to pass tests

3. **Service layer** (if applicable)
   - Write service interface
   - Write service tests (business logic, validation, error cases, edge cases)
   - Implement service to pass tests

4. **DTOs** (if applicable)
   - Define DTOs with `[Required]` attributes

5. **Controller layer** (if applicable)
   - Write controller/integration tests (endpoint behavior, status codes, error responses)
   - Implement controller to pass tests

6. **Backend verification**
   - `dotnet build` — confirm it compiles
   - `dotnet test` — confirm all tests pass (new and existing)

7. **Type regeneration** (if DTOs changed)
   - Restart backend
   - Run `npm run generate-api-types` in `petstore-web/`

8. **Frontend API layer** (if applicable)
   - Add API call functions in `api/`

9. **Frontend hooks/context** (if applicable)
   - Write hook/context tests
   - Implement hooks/context to pass tests

10. **Frontend components** (if applicable)
    - Write component tests (render, interaction, edge cases)
    - Implement components to pass tests

11. **Frontend verification**
    - `npx tsc --noEmit` — type check
    - `npx vitest run` — all tests pass

Present the plan to the user for approval before proceeding.

## Phase 5: Execute Iteratively

Execute each plan step one at a time. After completing each step:

1. Mark the task as completed
2. Print a **short TDD status line**: `RED → GREEN` (wrote failing test, then made it pass) or `GREEN` (implementation only, no test needed for this step)
3. If any test fails unexpectedly, stop and explain before moving on

## Phase 6: Final Summary

After all steps are complete, print:

- The architecture diagram again (updated if anything changed during implementation)
- All files created or modified, grouped by layer
- Test coverage summary: how many tests were added, what they cover
- Commands the user needs to run (restart servers, etc.)
- Suggested manual testing steps

## Important Rules

- Follow all conventions from CLAUDE.md (TypeScript constraints, `[Required]` on DTOs, `ApiResponse<T>` envelope, etc.)
- **Tests are not optional.** Every layer with logic gets tests before implementation.
- **Don't write tests that just test the framework.** Test business logic, edge cases, and integration points.
- If the user says "skip" for any step, skip it without asking again.
- If the user's answers during the grill reveal that the feature is more complex than initially described, say so and suggest scoping it down. Don't silently take on unbounded scope.
