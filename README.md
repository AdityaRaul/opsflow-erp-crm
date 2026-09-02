# OpsFlow — Mini ERP + CRM Operations Portal

OpsFlow is a role-aware internal portal for customer CRM, inventory control, and sales challans. It was built for a wholesale/distribution workflow with careful stock confirmation logic.

## Architecture

- **Frontend:** React, TypeScript, Vite; responsive admin UI
- **Backend:** Node.js, Express, TypeScript, REST API with Zod validation
- **Data:** PostgreSQL, direct parameterized queries and transactions
- **Hosting:** Netlify (frontend) + Render (API) + Render PostgreSQL / Neon

When a challan is confirmed, the API locks each product row inside one PostgreSQL transaction, checks availability, writes an immutable item snapshot, reduces stock, and creates an OUT movement. Therefore stock cannot become negative during concurrent requests.

## Features

- JWT login, with Admin, Sales, Warehouse and Accounts roles
- Customer CRUD API, search/pagination, status and follow-up notes
- Product catalogue, low-stock visibility, audited IN/OUT movements
- Multi-item sales challans with automatic numbers, drafts and confirmation
- Standard validation, HTTP status codes and human-readable error responses

## Local setup

Prerequisites: Node.js 20+ and PostgreSQL 14+.

1. Create an empty database named `opsflow`.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` and a secure `JWT_SECRET`.
3. Copy `client/.env.example` to `client/.env`.
4. Install dependencies: `npm install`
5. Create tables and demo data: `npm run seed`
6. Start both apps: `npm run dev`

Frontend: `http://localhost:5173`; API: `http://localhost:4000/health`.

## Demo accounts

All use password `Password@123`:

| Role | Email |
|---|---|
| Admin | admin@opsflow.test |
| Sales | sales@opsflow.test |
| Warehouse | warehouse@opsflow.test |
| Accounts | accounts@opsflow.test |

## Deployment: Render + Netlify

1. Create a managed PostgreSQL database in Render (or Neon), then run the contents of `server/src/schema.sql` in its SQL console. Run the seed command locally against that database if demo users are needed.
2. Push this repository to GitHub. In Render, create a **Web Service** from the repo; it will detect `render.yaml`. Set `DATABASE_URL` and `CLIENT_URL` (your Netlify production URL). Render generates `JWT_SECRET` automatically.
3. In Netlify, import the same GitHub repository. Its `netlify.toml` sets `client` as the base directory. Set `VITE_API_URL` to the public Render service URL, then deploy.
4. Update Render `CLIENT_URL` with the final Netlify URL and redeploy the API, so browser CORS is restricted to your client.

Environment variables are never committed. Render owns server secrets; Netlify holds the public API base URL.

## API overview

`POST /auth/login`, `GET /auth/me`, `GET|POST /customers`, `GET|PUT /customers/:id`, `POST /customers/:id/followups`, `GET|POST /products`, `PUT /products/:id`, `POST /products/:id/movements`, `GET /stock-movements`, `GET|POST /challans`, `GET /dashboard`.

Use an `Authorization: Bearer <token>` header after login. The frontend provides a complete working sales flow; all endpoints can be imported manually into Postman.

## Assumptions / limits

Purchase orders, invoices, attachments and PDF generation are intentionally outside the time-boxed core. Product edits can set a stock figure directly; production usage should route that adjustment through a stock-movement endpoint only. Add pagination to product/challan lists as data volume grows. A ready-to-import Postman collection is in `postman/OpsFlow.postman_collection.json`.
