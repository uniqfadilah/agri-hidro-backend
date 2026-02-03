Create User management features with role-based access control in NestJS.

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
- User CRUD (limited)
- Role-based access control (admin | user)
- Password update
- Secure data access

Environment:
- Development
- Production

Rules:
- Admin can list all users
- Admin can delete users
- Admin can update any user's password
- Non-admin (user):
  - Can only access their own data
  - Can only update their own password
- Never return password in any response
- Hash password using bcrypt
- Validate input using DTO
- Use guards for authentication & authorization
- Follow clean architecture principles

User Properties:
- id: string
- username: string
- role: admin | user
- createdAt: datetime
- updatedAt: datetime

Endpoints:
- GET /users
  - Access: admin only
  - Description: Get user list

- DELETE /users/:id
  - Access: admin only
  - Description: Delete user by id

- PATCH /users/:id/password
  - Access:
    - admin → can update any user
    - user → only own user id
  - Description: Update user password only

DTO:
- UpdatePasswordDto
  - password: string (required)

Tasks:
1️⃣ User Module Setup
- Create UsersModule, UsersController, and UsersService
- Register under `src/modules/users`

2️⃣ Authorization
- Protect routes using AuthGuard (JWT)
- Implement RoleGuard for admin-only routes
- Validate ownership for non-admin access

3️⃣ Get User List
- Admin-only access
- Return list without sensitive fields

4️⃣ Delete User
- Admin-only access
- Delete user by id
- Handle non-existing user gracefully

5️⃣ Update Password
- Hash new password using bcrypt
- Admin can update any user
- User can only update their own password
- Reject unauthorized access clearly

Output:
- UsersModule
- UsersController
- UsersService
- DTOs
- Guards for role & ownership

Result:
- Admin can manage users securely
- Users can manage their own password only
- Role-based access enforced consistently
- Ready for FE integration (Next.js & mobile)
