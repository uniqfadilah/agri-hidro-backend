Create Seller, Material, and Expense modules in NestJS using Knex.js, Objection.js, and PostgreSQL.

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

Table: sellers
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- seller_name: string (not nullable)
- address: string (nullable)
- contact: string (nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

--------------------------------

Table: materials
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- material_name: string (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

--------------------------------

Table: material_sellers
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- material_id: uuid (not nullable, FK → materials.id)
- seller_id: uuid (not nullable, FK → sellers.id)
- price: numeric (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

Constraints:
- Unique (material_id, seller_id)

--------------------------------

Table: expenses
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- user_id: uuid (not nullable, FK → users.id)  // who created the expense
- seller_id: uuid (not nullable, FK → sellers.id)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

--------------------------------

Table: expense_materials
Columns:
- id: uuid (primary key, default uuid_generate_v4())
- expense_id: uuid (not nullable, FK → expenses.id, on delete cascade)
- material_id: uuid (not nullable, FK → materials.id)
- price: numeric (not nullable)
- quantity: integer (not nullable)
- created_at: timestamp (default now)
- updated_at: timestamp (default now)

--------------------------------
MIGRATION RULES
--------------------------------
- Enable "uuid-ossp" extension if not exists
- Use knex.schema.createTable
- Use UTC timestamps
- Use proper foreign key constraints
- Cascade delete expense_materials when expense is deleted

--------------------------------
ORM MODELS (Objection.js)
--------------------------------

Create models:

1. SellerModel
   - tableName: sellers
   - relationMappings:
     - materials (HasManyRelation → MaterialSellerModel)
     - expenses (HasManyRelation → ExpenseModel)

2. MaterialModel
   - tableName: materials
   - relationMappings:
     - sellers (HasManyRelation → MaterialSellerModel)

3. MaterialSellerModel
   - tableName: material_sellers
   - relationMappings:
     - material (BelongsToOneRelation → MaterialModel)
     - seller (BelongsToOneRelation → SellerModel)

4. ExpenseModel
   - tableName: expenses
   - relationMappings:
     - user (BelongsToOneRelation → UserModel)
     - seller (BelongsToOneRelation → SellerModel)
     - materials (HasManyRelation → ExpenseMaterialModel)

5. ExpenseMaterialModel
   - tableName: expense_materials
   - relationMappings:
     - expense (BelongsToOneRelation → ExpenseModel)
     - material (BelongsToOneRelation → MaterialModel)

--------------------------------
ACCESS CONTROL
--------------------------------
- All authenticated users:
  - Can get seller list
  - Can get material list
  - Can get own expenses
  - Can create expense
- Admin users:
  - Can get all expenses
  - Can create/update/delete seller
  - Can create/update/delete material
  - Can manage material_sellers
  - Can delete any expense

--------------------------------
MODULE STRUCTURE
--------------------------------

src/modules/seller/
src/modules/material/
src/modules/expense/

Each module contains:
- module.ts
- controller.ts
- service.ts
- models/
- dto/

--------------------------------
DTOS
--------------------------------

CreateSellerDto:
- seller_name: string (required)
- address: string (optional)
- contact: string (optional)

CreateMaterialDto:
- material_name: string (required)

CreateMaterialSellerDto:
- material_id: uuid (required)
- seller_id: uuid (required)
- price: number (required, > 0)

CreateExpenseDto:
- seller_id: uuid (required)
- materials: array (required)
  - material_id: uuid
  - price: number
  - quantity: number

--------------------------------
CONTROLLER ENDPOINTS
--------------------------------

Seller:
- GET    /sellers
- POST   /sellers              (all user)
- PUT    /sellers/:id          (all user)
- DELETE /sellers/:id          (all user)

Material:
- GET    /materials
- POST   /materials            (all user)

Material Seller:
- POST   /material-sellers     (all user)

Expense:
- GET    /expenses
- POST   /expenses
- DELETE /expenses/:id         (admin or owner)

--------------------------------
SERVICE RULES
--------------------------------
- Use Objection.js models only
- Use database transactions for expense + expense_materials creation
- Validate material and seller relationships
- Enforce ownership on delete
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
- Ready for cost tracking & reporting

--------------------------------
OUTPUT
--------------------------------
- Knex migration files
- Objection.js models
- Seller, Material, Expense modules
- DTOs, controllers, services
- Production-ready implementation