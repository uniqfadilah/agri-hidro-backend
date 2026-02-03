Create Customer management features with role-based access control in NestJS.

Context:
- Company: Agri Hidro Tekno
- Project: IoT backend MVP
- Tech Stack:
  - Backend: NestJS (TypeScript)
  - Query builder: Knex
  - Auth: JWT-based (prepared)
- Use rules from /prompts/_base
- Depends on Auth module

Scope:
- Customer creation
- Customer deletion
- Customer listing
- Role-based access control

Environment:
- Development
- Production

Rules:
- All authenticated roles (admin | user) can get customer list
- Only admin can create customer
- Only admin can delete customer
- Use snake_case for database fields
- Validate input using DTO
- Use guards for authentication & authorization
- Follow clean architecture principles
- Do not expose unnecessary fields

Customer Properties:
- id: string
- name: string
- pic: string
- pic_phone_number: string
- createdAt: datetime
- updatedAt: datetime

Endpoints:
- GET /customers
  - Access: admin, user
  - Description: Get customer list

- POST /customers
  - Access: admin only
  - Description: Create new customer

- DELETE /customers/:id
  - Access: admin only
  - Description: Delete customer by id

DTO:
- CreateCustomerDto
  - name: string (required)
  - pic: string (required)
  - pic_phone_number: string (required)

Tasks:
1️⃣ Customer Module Setup
- Create CustomersModule, CustomersController, and CustomersService
- Register under `src/modules/customers`

2️⃣ Authorization
- Protect all routes using AuthGuard (JWT)
- Restrict create & delete & update routes using RoleGuard (admin only)

3️⃣ Get Customer List
- Allow access for all authenticated users
- Return clean customer data

4️⃣ Create Customer
- Admin-only access
- Validate input
- Store data using Knex
5️⃣ Delete Customer
- Admin-only access
- Handle non-existing customer gracefully
6️⃣ Update Customer
- Admin-only access


Output:
- CustomersModule
- CustomersController
- CustomersService
- DTOs
- Role-based guards applied

Result:
- Customers can be listed by all roles
- Customers can be created, deleted update by admin only
- Snake_case field naming is consistent
- Ready for FE and mobile integration
