import  {pool}  from '../db';
import bcrypt from 'bcryptjs';

// async function seedUsers() {
//   const users = [
//     {
//       name: 'Alice Manager',
//       email: 'alice@company.com',
//       password: 'alice123',
//       role: 'manager',
//       skills: [],
//       seniority: null,
//       max_capacity: 100,
//     },
//     {
//       name: 'Bob Engineer',
//       email: 'bob@company.com',
//       password: 'bob123',
//       role: 'engineer',
//       skills: ['React', 'Node.js'],
//       seniority: 'mid',
//       max_capacity: 100,
//     },
//     {
//       name: 'Charlie Engineer',
//       email: 'charlie@company.com',
//       password: 'charlie123',
//       role: 'engineer',
//       skills: ['Python', 'PostgreSQL'],
//       seniority: 'junior',
//       max_capacity: 80,
//     },
//   ];

//   for (const user of users) {
//     const hashed = await bcrypt.hash(user.password, 10);
//     await pool.query(
//       `INSERT INTO users (name, email, password, role, skills, seniority, max_capacity)
//        VALUES ($1, $2, $3, $4, $5, $6, $7)
//        ON CONFLICT (email) DO NOTHING`,
//       [
//         user.name,
//         user.email,
//         hashed,
//         user.role,
//         user.skills,
//         user.seniority,
//         user.max_capacity,
//       ]
//     );
//   }

//   console.log('✅ Seed complete');
//   process.exit();
// }

// seedUsers().catch((err) => {
//   console.error('❌ Seed failed:', err);
//   process.exit(1);
// });


async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      skills TEXT[],
      seniority TEXT,
      max_capacity INTEGER
    );
  `);
   await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      required_skills TEXT[]
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      allocation_percentage INTEGER,
      start_date DATE,
      end_date DATE
    );
  `);
}

async function seedUsers() {
  await createTables(); //  Ensure table exists before inserting

  const users = [
    {
      name: 'Alice Manager',
      email: 'alice@company.com',
      password: 'alice123',
      role: 'manager',
      skills: [],
      seniority: null,
      max_capacity: 100,
    },
    {
      name: 'Bob Engineer',
      email: 'bob@company.com',
      password: 'bob123',
      role: 'engineer',
      skills: ['React', 'Node.js'],
      seniority: 'mid',
      max_capacity: 100,
    },
    {
      name: 'Charlie Engineer',
      email: 'charlie@company.com',
      password: 'charlie123',
      role: 'engineer',
      skills: ['Python', 'PostgreSQL'],
      seniority: 'junior',
      max_capacity: 80,
    },
  ];

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role, skills, seniority, max_capacity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        user.name,
        user.email,
        hashed,
        user.role,
        user.skills,
        user.seniority,
        user.max_capacity,
      ]
    );
  }

  console.log('✅ Seed complete');
  process.exit();
}

seedUsers().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
