Create a Customer Item Management module in NestJS using Knex.js, Objection.js, and PostgreSQL.

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
TABLE
--------------------------------

Table: customer_items
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- customer_id: uuid (not nullable, FK → customers.id)
- item_id: uuid (not nullable, FK → items.id)
- price: numeric (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

Constraints:
- Unique constraint on (customer_id, item_id)
- Cascade delete when customer or item is deleted

--------------------------------
MIGRATION RULES
--------------------------------
- Enable "uuid-ossp" extension if not exists
- Use knex.schema.createTable
- Use UTC timestamps
- Use proper foreign key constraints

--------------------------------
ORM MODELS (Objection.js)
--------------------------------

Create model:
CustomerItemModel
- tableName: customer_items
- relationMappings:
  - customer (BelongsToOneRelation → CustomerModel)
  - item (BelongsToOneRelation → ItemModel)
- JSON schema validation
- Auto-manage timestamps

--------------------------------
ACCESS CONTROL
--------------------------------
- All authenticated users:
  - Can get customer item list
  - Can get customer item detail
  - Can create customer item
  - Can update customer item price
  - Can delete customer item

--------------------------------
MODULE STRUCTURE
--------------------------------

src/modules/customer-item/
- customer-item.module.ts
- customer-item.controller.ts
- customer-item.service.ts
- models/
  - customer-item.model.ts
- dto/
  - create-customer-item.dto.ts
  - update-customer-item.dto.ts

--------------------------------
DTOS
--------------------------------

CreateCustomerItemDto:
- customer_id: uuid (required)
- item_id: uuid (required)
- price: number (required, > 0)

UpdateCustomerItemDto:
- price: number (required, > 0)

--------------------------------
CONTROLLER ENDPOINTS
--------------------------------

- GET    /customer-items
- GET    /customer-items/:id
- POST   /customer-items
- PUT    /customer-items/:id
- DELETE /customer-items/:id

--------------------------------
SERVICE RULES
--------------------------------
- Use Objection.js models (no direct Knex in controller)
- Validate customer and item existence
- Enforce unique (customer_id, item_id)
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
- Ready for pricing override per customer

--------------------------------
OUTPUT
--------------------------------
- Knex migration file
- Objection.js model
- Module, controller, service, DTOs
- Production-ready implementation
