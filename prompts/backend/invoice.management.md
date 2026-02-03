Create an Invoice Management module in NestJS using Knex.js, Objection.js, and PostgreSQL.

Context:
- Company: Agri Hidro Tekno
- Project: IoT Backend MVP
- Backend Stack:
  - NestJS
  - Knex.js
  - Objection.js
  - PostgreSQL
  - Docker (development & production)
- Use coding rules and conventions from /prompts/_base
- Follow clean code and scalable architecture principles
- No API versioning

Database:
- PostgreSQL
- Knex for migrations
- Objection.js for ORM models
- Use snake_case for table and column names
- Use UUID for all primary and foreign keys

--------------------------------
TABLES
--------------------------------

Table: invoices
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- customer_id: uuid (not nullable, FK → customers.id)
- user_id: uuid (not nullable, FK → users.id)
- status: enum ('new', 'on_progress', 'done_paid')
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

Table: invoice_items
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- invoice_id: uuid (not nullable, FK → invoices.id, on delete cascade)
- item_id: uuid (not nullable, FK → items.id)
- price: numeric (not nullable)
- quantity: integer (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

--------------------------------
MIGRATION RULES
--------------------------------
- Enable "uuid-ossp" extension if not exists
- Use knex.schema.createTable
- Use PostgreSQL enum for invoice status
- Cascade delete invoice_items when invoice is deleted
- Use UTC timestamps

--------------------------------
ORM MODELS (Objection.js)
--------------------------------

Create models:
1. InvoiceModel
   - tableName: invoices
   - relationMappings:
     - customer (BelongsToOneRelation)
     - user (BelongsToOneRelation)
     - items (HasManyRelation → InvoiceItemModel)
   - JSON schema validation
   - Auto-manage timestamps

2. InvoiceItemModel
   - tableName: invoice_items
   - relationMappings:
     - invoice (BelongsToOneRelation)
     - item (BelongsToOneRelation)
   - JSON schema validation

--------------------------------
ACCESS CONTROL
--------------------------------
- Authenticated users:
  - Can create invoice
  - Can get invoice list
  - Can get own invoice detail
- Admin users:
  - Can get all invoices
- Delete invoice:
  - Allowed if user is admin
  - OR if invoice.user_id === authenticated user id
- Status update rules:
  - Only admin can change status to 'done_paid'
  - Normal users can change status from 'new' → 'on_progress'

--------------------------------
MODULE STRUCTURE
--------------------------------

src/modules/invoice/
- invoice.module.ts
- invoice.controller.ts
- invoice.service.ts
- models/
  - invoice.model.ts
  - invoice-item.model.ts
- dto/
  - create-invoice.dto.ts
  - update-invoice-status.dto.ts

--------------------------------
DTOS
--------------------------------

CreateInvoiceDto:
- customer_id: uuid (required)
- items: array (required)
  - item_id: uuid
  - price: number
  - quantity: number

UpdateInvoiceStatusDto:
- status: 'new' | 'on_progress' | 'done_paid'

--------------------------------
CONTROLLER ENDPOINTS
--------------------------------

- POST   /invoices
- GET    /invoices
- GET    /invoices/:id
- PATCH  /invoices/:id/status
- DELETE /invoices/:id        (admin or invoice owner)

--------------------------------
SERVICE RULES
--------------------------------
- Use Objection.js models (no direct Knex in controller)
- Use database transaction when creating invoice + invoice_items
- Validate foreign keys (customer, items, user)
- Validate ownership before delete
- Prevent invalid status transitions
- Update updated_at on changes
- Use async/await
- Return clean response objects

--------------------------------
DOCKER & ENVIRONMENT
--------------------------------
- Compatible with Docker dev & prod
- Development:
  - Auto-run migrations on startup
- Production:
  - Migrations runnable manually or via entrypoint
- All configuration from environment variables

--------------------------------
GENERAL RULES
--------------------------------
- No hardcoded values
- Centralized error handling
- Clean, readable, scalable code
- Follow NestJS best practices
- Ready for IoT order flow and thermal printer integration

--------------------------------
OUTPUT
--------------------------------
- Knex migration files
- Objection.js models
- Invoice module, controller, service, DTOs
- Production-ready implementation
