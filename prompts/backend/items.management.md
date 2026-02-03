Create an Item Management module in NestJS using Knex.js, Objection.js, and PostgreSQL.

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
- Knex for migrations and connection
- Objection.js for ORM models
- Use snake_case for table and column names

Table: items
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- name: string (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

Migration Rules:
- Enable "uuid-ossp" extension if not exists
- Use knex.schema.createTable
- Use UTC timestamps
- Do not use raw SQL unless required

ORM Model:
- Create ItemModel using Objection.js
- Table name: items
- Primary key: id
- Use JSON schema validation
- Auto-manage created_at and updated_at

Access Control:
- All authenticated users:
  - Can get item list
- Admin only:
  - Can create item
  - Can update item
  - Can delete item

Authentication & Authorization:
- Use AuthGuard for authentication
- Use RolesGuard for role-based access
- Supported roles: admin | user

Module Structure:
src/modules/item/
- item.module.ts
- item.controller.ts
- item.service.ts
- models/
  - item.model.ts
- dto/
  - create-item.dto.ts
  - update-item.dto.ts

DTOs:
- CreateItemDto
  - name: string (required, trimmed, not empty)
- UpdateItemDto
  - name: string (required, trimmed, not empty)

Controller Endpoints:
- GET    /items
- POST   /items           (admin only)
- PUT    /items/:id       (admin only)
- DELETE /items/:id       (admin only)

Service Rules:
- Use Objection.js models for database access
- Do not access Knex directly inside controllers
- Validate item existence before update or delete
- Update updated_at automatically
- Use async/await
- Return clean response objects

Knex & Objection Setup:
- Initialize Knex connection
- Bind Knex to Objection Model
- Provide database connection via NestJS provider
- Load config from environment variables
- Support development and production environments

Docker Rules:
- Compatible with Docker development and production
- Development:
  - Auto-run Knex migrations on container startup
- Production:
  - Migrations runnable via command or entrypoint

General Rules:
- No hardcoded values
- Centralized error handling
- Clean and readable code
- Follow NestJS best practices
- Ready for scaling and future IoT integrations

Output:
- Knex migration file
- Objection.js Item model
- Item module, controller, service, DTOs
- Clean, production-ready implementation
