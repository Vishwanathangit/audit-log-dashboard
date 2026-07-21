# 🛡️ Audit Log Dashboard

A full-stack security audit log management system where security engineers can bulk upload, view, filter, search, sort, and investigate system audit logs — with all filtering, searching, sorting, and pagination logic handled entirely on the server for performance at scale.

**Live Link:** [https://audit-log-dashboard-omega.vercel.app](https://audit-log-dashboard-omega.vercel.app)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Design Patterns Used](#-design-patterns-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Generating Test Data](#-generating-test-data)
- [API Endpoints](#-api-endpoints)
- [CSV Upload Format](#-csv-upload-format)
- [Deployment](#-deployment)
- [Development Notes](#-development-notes)
- [License](#-license)

---

## 🎯 Features

- 📤 **Bulk Upload API** — accepts and stores 10,000+ audit log records in a single request (client-side CSV parsing + validation, single JSON payload to the server)
- 📊 **Server-Side Data Table** — all filtering, searching, sorting, and pagination is computed on the backend via MongoDB queries, not in the browser, so performance stays consistent regardless of dataset size
- 🔍 **Search** — case-insensitive search across actor, action, resource, and IP address fields
- 🎚️ **Filters** — severity, status, resource type, region, action, actor, and date range, with future dates disabled in the calendar
- 🏷️ **Active Filter Chips** — every active filter/search term shown as a removable chip, plus a one-click "Clear Filters" action
- ↕️ **Smart Sorting** — logical severity ranking (LOW → MEDIUM → HIGH → CRITICAL) instead of alphabetical sort, alongside standard sorting on timestamp, action, region, and status
- 🔗 **URL State Persistence** — filters, search, sort, and pagination are reflected in the URL query string, so views are shareable and restorable on refresh
- 🔎 **Investigate Logs** — click any row to view full record details in a dialog
- 🔢 **Serial Numbering** — a true cross-page S.No column reflecting each record's actual position in the full filtered dataset
- 💀 **Skeleton Loading States** — smooth loading experience without layout shift or "flashing" during search/filter/sort
- 📱 **Fully Responsive UI** — built with Tailwind CSS and shadcn/ui, works cleanly across desktop and mobile
- 🎨 **Centralized Theming** — no hardcoded colors anywhere in the codebase; all colors defined as CSS variables and consumed via Tailwind utility classes

---

## ⚙️ Tech Stack

### Frontend

| Technology | Version |
|---|---|
| React | 19.2.7 |
| TypeScript | 6.0.2 |
| Vite | 8.1.1 |
| Zustand | 5.0.14 |
| TanStack React Table | 8.21.3 |
| Tailwind CSS | 4.3.3 |
| shadcn/ui | 4.13.1 |
| Radix UI | 1.6.2 |
| React Router DOM | 7.18.1 |
| Zod | 4.4.3 |
| Axios | 1.18.1 |
| PapaParse | 5.5.4 |
| date-fns | 4.4.0 |
| react-day-picker | 10.0.1 |
| Lucide React | 1.25.0 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| tailwind-merge | 3.6.0 |
| tw-animate-css | 1.4.0 |
| @fontsource-variable/geist | 5.3.0 |

**Dev Dependencies**

| Technology | Version |
|---|---|
| ESLint | 10.6.0 |
| typescript-eslint | 8.62.0 |
| @vitejs/plugin-react | 6.0.3 |
| eslint-plugin-react-hooks | 7.1.1 |
| eslint-plugin-react-refresh | 0.5.3 |

### Backend

| Technology | Version |
|---|---|
| Node.js | 18+ |
| Express | 5.2.1 |
| TypeScript | 5.7.3 |
| Mongoose | 9.7.4 |
| MongoDB Atlas | — |
| Zod | 4.4.3 |
| Helmet | 8.3.0 |
| Morgan | 1.11.0 |
| CORS | 2.8.6 |
| dotenv | 17.4.2 |
| ts-node-dev | 2.0.0 |
| @vercel/node | 5.8.26 |

### Tooling & Environment

| Tool | Version |
|---|---|
| Package Manager | pnpm ^11.9.0 |
| IDE | Antigravity 2.3.1 |
| Deployment | Vercel (Services — single project, frontend + backend on one domain) |

---

## 🧩 Design Patterns Used

Design patterns were applied only where they solved a real problem in this project — not added for the sake of it.

| Pattern | Where | Why |
|---|---|---|
| **Singleton** | `backend/src/config/db.ts` | Ensures only one MongoDB connection is ever created and reused across the app, checked via `mongoose.connection.readyState` before connecting again |
| **Factory Method** | `backend/src/utils/queryBuilder.util.ts` | Dynamically builds MongoDB filter/sort query objects based on whichever query params are present, avoiding a long if/else chain and centralizing all filter-construction logic in one place |

Abstract Factory and Prototype patterns were considered but intentionally **not** used, as this project has no families of related object types and no expensive object-cloning use case that would justify them.

---

## 📁 Project Structure

```text
audit-log-dashboard/
│
├── vercel.json              # Root — Vercel Services routing (frontend/backend split)
│
├── backend/
│   ├── api/
│   │   └── index.ts         # Serverless entry point (exports Express app for Vercel)
│   ├── src/
│   │   ├── config/          # MongoDB connection (Singleton)
│   │   ├── constants/       # Enum-like constant arrays (severity, status, etc.)
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Error handler, 404 handler
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic / DB operations
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── utils/           # Query builder (Factory Method), helpers
│   │   ├── validators/      # Zod schemas
│   │   ├── app.ts           # Express app config
│   │   └── server.ts        # Entry point (local dev only)
│   ├── scripts/
│   │   └── generate-test-logs.js
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── vercel.json           # SPA fallback rewrite for client-side routing
│   ├── src/
│   │   ├── api/              # Axios instance + API calls
│   │   ├── components/
│   │   │   ├── ui/           # shadcn generated components
│   │   │   ├── layout/       # Header
│   │   │   ├── logs/         # Table, filters, chips, dialogs, badges
│   │   │   └── common/       # DateRangePicker
│   │   ├── constants/        # Enum values, color maps, page size options
│   │   ├── pages/             # DashboardPage
│   │   ├── store/             # Zustand store
│   │   ├── types/             # Shared TypeScript interfaces
│   │   ├── utils/             # Date formatting, debounce hook
│   │   ├── validators/        # Zod schemas
│   │   ├── index.css          # Centralized CSS color variables
│   │   └── App.tsx
│   ├── vite.config.ts         # Includes dev-only /api proxy to backend
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| pnpm | ^11.9.0 |
| MongoDB Atlas account (or local MongoDB) | — |

### Clone the Repository

```bash
git clone https://github.com/Vishwanathangit/audit-log-dashboard.git
cd audit-log-dashboard
```

### Install Dependencies

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

---

## 🌍 Environment Variables

### Backend — `backend/.env`

```env
PORT=<PORT>
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:<PORT>
```

| Variable | Description |
|---|---|
| `PORT` | Port the local Express server binds to (used only in local dev; ignored on Vercel) |
| `MONGODB_URI` | MongoDB Atlas (or local) connection string |
| `FRONTEND_URL` | Local/staging frontend origin, used by the CORS middleware |

### Frontend — `frontend/.env`

```env
VITE_API_URL=/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Relative base path for all API calls. Set to `/api` for both local dev and production — locally, Vite's dev server proxy (see `vite.config.ts`) forwards `/api/*` requests to the backend's local port; in production, Vercel Services routes `/api/*` to the backend automatically since both are served from the same domain. |

---

## ▶️ Running the Application

### Backend

```bash
cd backend
pnpm dev        # start dev server (ts-node-dev, hot reload)
pnpm build      # compile TypeScript to dist/
pnpm start      # run compiled production build
```

Runs on: `http://localhost:<PORT>`

### Frontend

```bash
cd frontend
pnpm dev        # start Vite dev server
pnpm build      # production build
pnpm preview    # preview production build locally
```

Runs on: `http://localhost:<PORT>`

> ⚠️ In `frontend/vite.config.ts`, the dev server proxy's `target` must point to the backend's actual local port (e.g., `http://localhost:5000`) so `/api/*` requests are correctly forwarded during local development.

---

## 🧪 Generating Test Data

A script is included to generate a realistic 10,000-record CSV file for testing the bulk upload feature at scale.

```bash
cd backend
pnpm run generate:csv
```

This creates `backend/scripts/test-logs-10000.csv`, which can be uploaded directly through the dashboard's **Import Logs** feature.

---

## 📡 API Endpoints

### Base URL

- **Local development:** `http://localhost:<FRONTEND_PORT>/api` (proxied by Vite to the backend)
- **Production:** `https://<your-deployed-domain>/api` (routed by Vercel Services to the backend)

### Audit Log Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/logs/bulk-upload` | Bulk insert up to 10,000 audit log records in a single request |
| `GET` | `/logs` | Fetch logs with server-side search, filter, sort, and pagination via query params |
| `GET` | `/health` | Health check endpoint |

### `GET /logs` — Supported Query Parameters

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 20, max: 100) |
| `sortBy` | string | Field to sort by (`timestamp`, `severity`, `action`, `region`, `status`) |
| `sortOrder` | string | `asc` or `desc` (default: `desc`) |
| `search` | string | Case-insensitive search across actor, action, resource, ipAddress |
| `severity` | string | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `status` | string | `Resolved`, `Unresolved` |
| `resourceType` | string | `USER`, `FILE`, `SYSTEM`, `API`, `DATABASE` |
| `region` | string | Exact/partial region match |
| `action` | string | Exact/partial action match |
| `actor` | string | Exact/partial actor match |
| `startDate` | string (ISO) | Start of timestamp range filter |
| `endDate` | string (ISO) | End of timestamp range filter |

---

## 📄 CSV Upload Format

The CSV headers must exactly match the field names below (case-sensitive):

```csv
actor,role,action,resource,resourceType,ipAddress,region,severity,status,timestamp
priya.nair@company.com,admin,DELETE_USER,/api/users/334,USER,192.168.1.45,ap-south-1,HIGH,Unresolved,2025-06-14T08:32:11Z
arjun.k@company.com,editor,UPDATE_FILE,/api/files/221,FILE,192.168.1.12,us-east-1,LOW,Resolved,2025-06-14T09:10:03Z
```

**Validation rules:**
- `resourceType` must be one of: `USER`, `FILE`, `SYSTEM`, `API`, `DATABASE`
- `severity` must be one of: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `status` must be one of: `Resolved`, `Unresolved`
- `timestamp` must be a valid ISO 8601 datetime string
- No empty cells in any column

---

## ☁️ Deployment

This project is deployed as a **single Vercel project using Vercel Services** — frontend and backend are built separately but served from **one shared domain**, with requests routed by path prefix.

### How routing works

- The **root-level `vercel.json`** defines two services (`frontend`, `backend`) and routes all `/api/*` requests to the backend, and everything else to the frontend:

```json
{
  "services": {
    "frontend": {
      "root": "frontend",
      "framework": "vite"
    },
    "backend": {
      "root": "backend",
      "entrypoint": "api/index.ts",
      "installCommand": "pnpm install --frozen-lockfile",
      "buildCommand": "pnpm run build"
    }
  },
  "rewrites": [
    {
      "source": "/api(/.*)?",
      "destination": {
        "service": "backend"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "frontend"
      }
    }
  ]
}
```

- **`frontend/vercel.json`** provides the standard SPA fallback so client-side routes (handled by React Router) don't 404 on direct visit or refresh:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

- **`backend/api/index.ts`** is the serverless entry point Vercel invokes — it exports the configured Express app (connecting to MongoDB at module load) without calling `app.listen()`, since Vercel's runtime handles invocation directly. The existing `backend/src/server.ts` (with `app.listen()`) is unchanged and still used for local development.

### Why same-origin instead of two separate deployments

Because frontend and backend share one domain in production, the frontend calls the API via a **relative path** (`VITE_API_URL=/api`) rather than a full backend URL — there's no cross-origin request in production, so CORS isn't strictly required there. The existing CORS configuration is still kept in place for local development, where the frontend (Vite) and backend (Express) run on different ports:

```javascript
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [process.env.FRONTEND_URL];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
```

### Deployment steps

1. Set the Vercel project's **Framework Preset** to **Services** (required for the `"services"` key in the root `vercel.json` to be recognized).
2. Add the `MONGODB_URI` environment variable in the Vercel project settings.
3. Deploy — Vercel builds the `frontend` and `backend` services independently and serves them together under one generated domain.

---

## 🛠️ Development Notes

- **Client-side CSV parsing over server-side file upload:** the CSV is parsed in the browser (PapaParse) and validated with Zod before being sent as a single JSON array to the bulk-upload endpoint. This keeps the backend free of file-handling dependencies (no `multer`) since it only ever receives structured JSON — matching the requirement of accepting records "in a single request" without adding unnecessary complexity.
- **Backend re-validates every record independently** with Zod regardless of frontend validation, since client-side checks can always be bypassed by direct API calls.
- **Severity sorts by logical rank, not alphabetically** — MongoDB alphabetical order (`CRITICAL, HIGH, LOW, MEDIUM`) does not reflect real-world severity, so severity sorting uses an aggregation pipeline mapping each level to a numeric rank instead.
- **Manual pagination/sorting/filtering mode** is used with TanStack Table, since the server — not the client — owns all data logic; the table only renders what it's given.
- **AbortController-based request cancellation** prevents race conditions from rapid filter changes or fast pagination clicks by cancelling any in-flight request before starting a new one.
- **React StrictMode** is enabled in development, which intentionally double-invokes effects to help catch missing cleanup logic — this causes two requests per action in dev only, and does not occur in production builds.
- **Vercel Services over two separate projects:** frontend and backend are deployed as one Vercel project (Services), sharing a single domain, rather than as two independently deployed projects. This removes cross-origin requests in production entirely and simplifies environment configuration (`VITE_API_URL=/api` works identically in both dev and prod, with the actual routing handled by Vite's dev proxy locally and Vercel's service rewrites in production).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Vishwanathan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```