# PetStore App

A full-stack pet store application with a .NET 10 Web API backend and a React + TypeScript frontend.

---

## Prerequisites

Make sure the following are installed before running the app:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| .NET SDK | 10.0 | https://dotnet.microsoft.com/download |
| Node.js | 18.x | https://nodejs.org |
| npm | 9.x | Comes with Node.js |

To verify your installations:

```bash
dotnet --version
node --version
npm --version
```

---

## Project Structure

```
PetStore/
├── PetStore.Api/        # .NET 10 Web API (backend)
└── petstore-web/        # React + TypeScript (frontend)
```

---

## Running the Backend (PetStore.Api)

### Step 1 — Navigate to the API project

```bash
cd PetStore.Api
```

### Step 2 — Restore dependencies

```bash
dotnet restore
```

### Step 3 — Run the API

```bash
dotnet run
```

The API will start on **http://localhost:5000**.

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/cart` | Get current cart with subtotals and grand total |
| `POST` | `/api/cart/items` | Add a product to the cart (body: `{ productId, quantity }`) |
| `DELETE` | `/api/cart/items/{productId}` | Remove a line item from the cart |

All responses follow a consistent envelope:

```json
{ "success": true, "data": { ... }, "error": null }
{ "success": false, "data": null, "error": "Reason here." }
```

---

## Running the Frontend (petstore-web)

### Step 1 — Navigate to the frontend project

```bash
cd petstore-web
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure the API URL (optional)

The frontend reads the API base URL from `.env`. The default points to `http://localhost:5000/api`.
If your API runs on a different port, update the value in `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 4 — Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Running Both Together

Open two terminal windows and run each from the repo root:

**Terminal 1 — Backend**
```bash
cd PetStore.Api && dotnet run
```

**Terminal 2 — Frontend**
```bash
cd petstore-web && npm install && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Features

- Browse a seeded product list across 5 categories (dry food, wet food, treats, toys, healthcare)
- Add products to cart with a custom quantity
- Cart shows per-line subtotals and a grand total
- Adding an existing product increments its quantity rather than duplicating it
- Remove any line item from the cart
- All API errors surface as toast notifications — no silent failures
- Non-positive quantities are rejected before the API is called
