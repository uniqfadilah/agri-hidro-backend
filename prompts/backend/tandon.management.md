You are a Senior Backend Engineer.

Generate a production-ready NestJS module using:

- NestJS (latest)
- Knex.js (query builder)
- Objection.js (ORM)
- PostgreSQL
- JWT authentication
- class-validator DTO
- Clean architecture

====================================
MODULE NAME
====================================

tandon

Path:
src/modules/tandon/

====================================
DATABASE TABLE
====================================

Table: tandons

columns:

id → uuid primary key
code → varchar(4) UNIQUE NOT NULL
jwt_secret → varchar(8) NOT NULL
max_level_water → numeric NOT NULL
min_level_water → numeric NOT NULL
current_level_water → numeric NOT NULL
created_at → timestamp
updated_at → timestamp

====================================
OBJECTION MODEL REQUIRED
====================================

Create TandonModel extends Model:

- static tableName = "tandons"
- idColumn = "id"

Include JSON schema validation inside model.

====================================
BUSINESS LOGIC
====================================

The system manages water tanks.

Each tandon has:

- code (4 digit string)
- jwt_secret (8 digit string)
- max_level_water
- min_level_water
- current_level_water

====================================
ACCESS RULES
====================================

ADMIN ONLY:

- create tandon
- update tandon
- delete tandon
- get list
- get detail

DEVICE ACCESS:

Water level update endpoint can be accessed by:

- tandon code
- JWT signed using that tandon's jwt_secret

The jwt_secret must be retrieved dynamically from DB
before verifying the token.

====================================
API ENDPOINTS
====================================

ADMIN:

POST /tandon
PATCH /tandon/:id
DELETE /tandon/:id
GET /tandon
GET /tandon/:id

DEVICE:

POST /tandon/device/update-water

BODY:

{
  "code": "1234",
  "current_level_water": 50
}

HEADER:

Authorization: Bearer <device-jwt>

====================================
VALIDATION RULES
====================================

code:

- required
- string
- length exactly 4

jwt_secret:

- required
- string
- length exactly 8

max_level_water:

- required number
- must be greater than min_level_water

current_level_water:

- must be between min and max

====================================
SECURITY FLOW FOR DEVICE UPDATE
====================================

1. Receive code from request body
2. Query tandon using Objection model
3. If not found → throw NotFoundException
4. Extract jwt_secret from DB
5. Verify JWT using jsonwebtoken.verify(token, jwt_secret)
6. If invalid → UnauthorizedException
7. Update current_level_water using Knex/Objection
8. Return updated row

====================================
KNEX REQUIREMENTS
====================================

Generate:

- knexfile.ts
- migration for tandons table
- seed example

====================================
OUTPUT REQUIRED
====================================

Generate:

- knex config
- migration file
- objection model
- DTO files
- controller
- service
- module
- dynamic JWT verification logic
- admin guard placeholder
- example HTTP requests

Code must be:

- fully typed
- production-ready
- clean NestJS architecture
- optimized queries
- no pseudo code

EXTRA FEATURES:

- auto-generate code (4 random digits)
- auto-generate jwt_secret (8 random digits)
- prevent duplicate code