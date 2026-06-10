# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack pet store app: .NET 10 Web API backend + React/TypeScript frontend (Vite). Single-page app with product browsing and cart management. Data is in-memory (no database).

## Commands

### Backend (PetStore.Api)

```bash
cd PetStore.Api && dotnet run                    # Start API on http://localhost:5171
dotnet test                                       # Run all backend tests (from repo root)
dotnet test --filter "FullyQualifiedName~CartServiceTests.AddToCart_ExistingProduct"  # Single test
```

Swagger UI: http://localhost:5171/swagger

### Frontend (petstore-web)

```bash
cd petstore-web && npm run dev                   # Start dev server on http://localhost:5173
cd petstore-web && npx vitest                    # Run all frontend tests
cd petstore-web && npx vitest cartContext         # Run tests matching a pattern
cd petstore-web && npx tsc --noEmit              # Type check without emitting
cd petstore-web && npm run generate-api-types    # Regenerate types from Swagger (backend must be running)
```

## Architecture

### Backend

Standard layered .NET API: Controllers → Services → Repositories. All API responses use a generic `ApiResponse<T>` envelope (`{ success, data, error }`).

- **Controllers** handle HTTP, catch exceptions, return structured errors
- **Services** contain business logic, map models to DTOs
- **Repositories** manage in-memory data (singleton lifetime). `ProductRepository` has hardcoded seed data. `CartRepository` is also singleton (single shared cart)
- **DTOs** use `[Required]` attributes so Swashbuckle generates non-optional fields in the OpenAPI spec

### Frontend

React SPA with no router — single page with product grid + cart sidebar.

- **`api/apiClient.ts`** — generic fetch wrapper that unwraps the `ApiResponse` envelope and throws `ApiError` on failure. Base URL comes from `VITE_API_BASE_URL` env var (defaults to `http://localhost:5171/api`)
- **`context/CartContext`** — shared cart state. Components use `useCart()` to read cart or call `addItem`/`removeItem`
- **`context/ToastContext`** — global toast notifications. Components call `showError()`/`showSuccess()`
- **`hooks/useProducts`** — fetches product list on mount, returns `{ products, loading, error }`

### API Contract (OpenAPI Codegen)

Frontend types are generated from the backend's Swagger spec — **do not manually edit `src/types/api.generated.ts`**.

Flow: C# DTOs → Swagger JSON → `openapi-typescript` → `api.generated.ts` → re-exported as aliases in `api.types.ts`

When backend DTOs change:
1. Restart the backend
2. Run `npm run generate-api-types` in `petstore-web/`

`api.types.ts` re-exports generated types as `Product`, `Cart`, `CartItem` and also contains the `ApiError` class (runtime, not generated).

## TypeScript Constraints

The frontend tsconfig enables `verbatimModuleSyntax` and `erasableSyntaxOnly`:
- Interfaces/types must use `import type` or inline `type` keyword: `import { ApiError, type Product } from ...`
- No constructor parameter properties (`public readonly x: string` in constructor params) — declare fields explicitly

## Testing

- **Backend**: xUnit. Tests in `PetStore.Api.Tests/`. Uses an `InMemoryProductRepository` stub.
- **Frontend**: Vitest + React Testing Library. Tests in `petstore-web/src/tests/`. Setup file at `src/tests/setup.ts`.
