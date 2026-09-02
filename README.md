# OpsFlow — Mini ERP + CRM Operations Portal

OpsFlow is a role-aware internal portal for customer CRM, inventory control, stock movements, and sales challans. It was built for a wholesale/distribution workflow with careful stock confirmation logic.

## Architecture

- **Frontend:** React, TypeScript, Vite; responsive admin UI
- **Backend:** Node.js, Express, TypeScript, REST API with Zod validation
- **Data:** PostgreSQL, parameterized queries and transactions
- **Authentication:** JWT with bcrypt password hashing
- **Authorization:** Role-based access control
- **Environment:** Local development setup

When a challan is confirmed, the API locks each product row inside one PostgreSQL transaction, checks availability, writes the challan item snapshot, reduces stock, and creates an OUT movement. If the stock validation fails, the transaction is rolled back.

## Features

- JWT login with Admin, Sales, Warehouse and Accounts roles
- Customer CRUD API, search/pagination, status and follow-up notes
- Product catalogue with low-stock visibility
- Audited IN/OUT stock movements
- Multi-item sales challans with automatic numbers
- Draft and confirmed challans
- Stock validation before challan confirmation
- Automatic stock reduction after confirmation
- Standard validation, HTTP status codes and human-readable error responses

## Local setup

Prerequisites: Node.js 20+ and PostgreSQL 14+.

1. Create an empty database named `opsflow`.
2. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`, `JWT_SECRET` and `CLIENT_URL`.
3. Copy `client/.env.example` to `client/.env`.
4. Install dependencies: `npm install`
5. Run the database schema from `server/src/schema.sql`.
6. Create tables and demo data using `npm run seed`.
7. Start both applications using `npm run dev`.

Frontend: `http://localhost:5173`

API: `http://localhost:4000`

Health check: `http://localhost:4000/health`

## Demo accounts

All use password `Password@123`:

| Role | Email |
|---|---|
| Admin | admin@opsflow.test |
| Sales | sales@opsflow.test |
| Warehouse | warehouse@opsflow.test |
| Accounts | accounts@opsflow.test |

These are dedicated demo credentials for evaluation only. No real personal passwords, database passwords, JWT secrets, API keys, or production credentials are included in the repository.

## API overview

### Authentication

`POST /auth/login`

`GET /auth/me`

### Customers

`GET /customers`

`POST /customers`

`GET /customers/:id`

`PUT /customers/:id`

`POST /customers/:id/followups`

### Products

`GET /products`

`POST /products`

`PUT /products/:id`

`POST /products/:id/movements`

### Stock movements

`GET /stock-movements`

### Challans

`GET /challans`

`POST /challans`

### Dashboard

`GET /dashboard`

Use an `Authorization: Bearer <token>` header after login for protected endpoints.

## Postman collection

A ready-to-import Postman collection is included in:

`postman/OpsFlow.postman_collection.json`

The collection can be used to test the backend APIs independently from the React frontend.

## Business flow

The main application workflow is:

```text
Login
  ↓
Dashboard
  ↓
Customers
  ↓
Customer Details
  ↓
Add Follow-up
  ↓
Inventory
  ↓
Stock Movement
  ↓
Create Draft Challan
  ↓
Create Confirmed Challan
  ↓
Validate Stock
  ↓
Reduce Stock
  ↓
Create OUT Movement
  ↓
Verify Stock Log


## Stock confirmation logic

When a confirmed challan is created:

1. The backend checks the requested products.
2. Product rows are locked inside a PostgreSQL transaction.
3. Available stock is validated.
4. Challan and item records are created.
5. Product stock is reduced.
6. An OUT stock movement is created.
7. If validation fails, the transaction is rolled back.

Example:

`Current Stock: 40`

`Confirmed Challan Quantity: 5`

`Remaining Stock: 35`

If the requested quantity is greater than the available stock, the transaction is rejected.

## Validation and error handling

The backend uses Zod for request validation.

Examples include:

- Required customer fields
- Valid email format
- Valid customer type and status
- Positive stock movement quantities
- Valid movement types
- Positive challan quantities
- Valid product and customer IDs

Common API responses include:

- `400` — Validation failed
- `401` — Authentication required or invalid token
- `403` — Permission denied
- `404` — Resource not found
- `409` — Conflict or insufficient stock
- `500` — Internal server error

## Role-based permissions

- **ADMIN:** Customer, product, inventory and sales operations
- **SALES:** Customer management, follow-ups and sales challans
- **WAREHOUSE:** Product and stock movement management
- **ACCOUNTS:** Protected application access according to implemented permissions

## Postman collection

A ready-to-import Postman collection is included at:

`postman/OpsFlow.postman_collection.json`

The collection can be used to test the backend APIs independently from the React frontend.

## Screen recording

The screen recording demonstrates the complete working application locally, including:

- Login
- Dashboard
- Customer management
- Customer details
- Customer follow-up
- Inventory
- Stock movement
- Draft challan
- Confirmed challan
- Automatic stock reduction
- Stock movement log

## Deployment

Cloud deployment has not been completed for the current submission.

The application is fully functional in the local development environment and can be run using the setup instructions provided in this README.

Local frontend:

`http://localhost:5173`

Local backend:

`http://localhost:4000`

Local backend health check:

`http://localhost:4000/health`

Cloud deployment can be added as a future improvement.

## Known limitations

- Purchase order management is not included.
- Invoice generation is not included.
- Invoice PDF generation is not included.
- Product image uploads are not included.
- Advanced reporting is not included.
- Advanced audit logging is not included.
- Docker deployment is not included.
- CI/CD pipeline is not included.
- Product and challan pagination can be expanded as data volume grows.
- Product edits can directly set the stock figure; a production system could route stock adjustments through a dedicated stock-movement workflow.

## Assumptions

- OpsFlow is designed for internal business users.
- PostgreSQL is used as the relational database.
- JWT is used for API authentication.
- Dedicated demo accounts are provided for evaluation.
- Confirmed challans use transaction-safe stock validation.
- Purchase orders and invoices are outside the core case-study scope.
- The current submission uses the working local environment.
- Cloud deployment is not included in the current submission.

## Security

Sensitive environment variables are never committed to the repository.

Do not commit:

`server/.env`

`client/.env`

`.env`

Never commit:

- Database passwords
- JWT secrets
- API keys
- Cloud provider credentials
- Personal passwords
- Production credentials

Example environment files can be provided as:

`server/.env.example`

`client/.env.example`

## Project structure

```text
FullStackDeveloper_CaseStudy/
│
├── client/
│   ├── src/
│   │   ├── main.tsx
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── vite.config.*
│
├── server/
│   ├── src/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── index.ts
│   │   ├── schema.sql
│   │   ├── seed.ts
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── postman/
│   └── OpsFlow.postman_collection.json
│
├── README.md
└── package.json

## Conclusion

OpsFlow demonstrates a complete full-stack ERP/CRM workflow using React, TypeScript, Node.js, Express, PostgreSQL and REST APIs.

The project demonstrates:

- JWT authentication
- Role-based authorization
- CRM customer management
- Customer follow-ups
- Product management
- Inventory management
- Stock IN/OUT tracking
- Sales challans
- Draft and confirmed transactions
- Transaction-safe stock validation
- Automatic stock reduction
- API validation and error handling

The application has been implemented and tested successfully in the local development environment.

## Author

**Aditya Ranjan Raul**

B.Tech — Computer Science Engineering

SOA — Full Stack Developer Case Study

2026
