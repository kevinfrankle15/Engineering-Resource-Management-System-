# Engineering Resource Management System – API Docs

This backend provides RESTful APIs to manage engineers, projects, and assignments.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a **JWT token** via:

```
Authorization: Bearer <your_token>
```

---

## Auth Routes

### POST `/auth/login`

Login as a user (engineer or manager).

```json
Body:
{
  "email": "alice@company.com",
  "password": "alice123"
}
```

Response:

```json
{
  "user": { "id": 1, "name": "Alice", "role": "manager" },
  "token": "<JWT_TOKEN>"
}
```

### GET `/auth/profile`

Get current user info from token.

---

## User Routes

### GET `/engineers`

Returns a list of engineers.

### GET `/engineers/:id/capacity`

Returns an engineer's total/available capacity.

---

## Project Routes

### GET `/projects`

List all projects.

### POST `/projects`

Create a new project.

```json
Body:
{
  "name": "New Project",
  "description": "Frontend + Backend app",
  "start_date": "2024-06-10",
  "end_date": "2024-08-20",
  "required_skills": ["React", "PostgreSQL"],
  "team_size": 5
}
```

---

## Assignment Routes

### GET `/assignments`

Get all engineer-project assignments.

### POST `/assignments`

Assign an engineer to a project.

```json
Body:
{
  "engineer_id": 2,
  "project_id": 1,
  "role": "Frontend Dev",
  "allocation_percentage": 40,
  "start_date": "2024-06-12",
  "end_date": "2024-07-30"
}
```

---

## Headers (for protected routes)

```http
Authorization: Bearer <your_token>
Content-Type: application/json
```

---

## Seeded Users for Testing

- alice@company.com / alice123 _(manager)_
- bob@company.com / bob123 _(engineer)_
- charlie@company.com / charlie123 _(engineer)_
