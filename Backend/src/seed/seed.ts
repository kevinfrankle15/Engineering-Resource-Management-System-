import { pool } from '../db';
import bcrypt from 'bcryptjs';

async function seedUsers() {
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
