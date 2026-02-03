Create an Auth module in NestJS.

Context:
- Company: Agri Hidro Tekno
- Project: IoT backend MVP
- Tech Stack:
  - Backend: NestJS (TypeScript)
  - Query builder: Knex
- Use rules from /prompts/_base

Scope:
- User registration
- User login
- Authentication foundation

Environment:
- Development
- Production

Rules:
- Hash passwords using bcrypt
- Never return password in any response
- Clear error messages for invalid credentials
- Prepare for JWT-based authentication
- Follow clean architecture principles

DTO:
- CreateUserDto
  - username: string (required)
  - password: string (required)
  - role: admin | user (required)
- LoginDto
  - username: string (required)
  - password: string (required)

Tasks:
1️⃣ Auth Module Setup
- Create auth module, controller, and service
- Register module under `src/modules/auth`

2️⃣ Registration
- Validate input using DTO
- Hash password before saving
- Store user using Knex

3️⃣ Login
- Validate credentials
- Compare password using bcrypt
- Return safe user payload

Output:
- AuthModule
- AuthController
- AuthService
- DTOs for register and login

Result:
- User can register and login
- Passwords are securely stored
- Auth module ready for JWT extension
