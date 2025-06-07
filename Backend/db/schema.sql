-- PostgreSQL schema setup for Engineering Resource Management System

--  Users table (Managers and Engineers)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('manager', 'engineer')) NOT NULL,
  skills TEXT[],
  seniority TEXT CHECK (seniority IN ('junior', 'mid', 'senior')),
  max_capacity INTEGER DEFAULT 100
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  required_skills TEXT[],
  team_size INTEGER,
  status TEXT CHECK (status IN ('planning', 'active', 'completed')) DEFAULT 'planning'
);

--  Assignments table (linking engineers to projects)
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  engineer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT,
  allocation_percentage INTEGER,
  start_date DATE,
  end_date DATE
);

-- 👇 Optional: create index for performance
CREATE INDEX idx_assignments_engineer_id ON assignments(engineer_id);
CREATE INDEX idx_assignments_project_id ON assignments(project_id);
