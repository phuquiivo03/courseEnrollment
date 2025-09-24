## Clinics Backend (PostgreSQL + Prisma)

Production-ready REST API for Courses and Enrollments with JWT auth, Prisma, Zod validation, Swagger docs, and tests (unit + integration).

### Prerequisites

- Node.js >= 18
- PostgreSQL (local or Docker) OR a cloud Postgres connection string
- Bun (optional) if you prefer `bun` scripts

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clinics?schema=public"
AUTH_SECRET="your-strong-jwt-secret"
AUTH_EXPIRES_IN="24h"
PORT=3000
```

If you don’t have Postgres locally, you can run one via Docker quickly:

```bash
docker run --name clinics-postgres -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=clinics -p 5432:5432 -d postgres:15-alpine
```

### 3) Generate Prisma Client and push schema

```bash
npx prisma generate
npx prisma db push
```

### 4) Run the server

- Using Bun scripts (recommended in this repo):

```bash
bun src/index.ts
# or
bun --watch src/index.ts
```

- Using Node/tsx (if you don’t use Bun):

```bash
npx tsx src/index.ts
```

Server will listen on: `http://localhost:3000`

### 5) API Documentation

- Swagger UI: `http://localhost:3000/api/docs`
- **Public API**: `https://devq-be0x7.site`

#### cURL Examples

**For local development:**

```bash
BASE_URL="http://localhost:3000"
```

**For production (public endpoint):**

```bash
BASE_URL="https://devq-be0x7.site"
```

Login (returns JWT):

```bash
curl -s -X POST $BASE_URL/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin"}'
```

Create Course (requires Bearer token):

```bash
ACCESS_TOKEN="<paste_token_here>"
curl -s -X POST $BASE_URL/api/courses \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"JS 101","description":"Intro","difficulty":"Beginner"}'
```

List Courses:

```bash
curl -s "$BASE_URL/api/courses?page=1&limit=10&difficulty=Beginner&search=js"
```

Enroll Student (requires Bearer token):

```bash
ACCESS_TOKEN="<paste_token_here>"
COURSE_ID="<an_existing_course_id>"
curl -s -X POST $BASE_URL/api/enrollments \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"studentEmail":"student@example.com","courseId":"'"$COURSE_ID"'"}'
```

List a Student's Enrollments:

```bash
curl -s "$BASE_URL/api/enrollments/students/student@example.com/enrollments"
```

### 6) Run Tests

This project uses Vitest for unit and integration tests.

```bash
# All tests
npm test
```

Integration tests spin up the app in-memory and use an in-memory SQLite database by overriding envs during test setup. No need for a running Postgres when running `npm test`.

### Project Highlights

- Prisma (PostgreSQL) with repository pattern
- Services with unit tests (Vitest)
- Integration tests (Supertest + Vitest, SQLite in-memory)
- Zod validation middleware
- Centralized error messages and error middleware
- Swagger/OpenAPI docs at `/api/docs`
