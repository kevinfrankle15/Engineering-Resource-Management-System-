import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  pool  from '../db';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  // try {
  //   const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  //   const user = userResult.rows[0];
   
    
  //   if (!user) {
  //     res.status(401).json({ message: 'Invalid credentials' });
  //     return;
  //   }

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) {
  //     res.status(401).json({ message: 'Invalid credentials' });
  //     return;
  //   }

  //   const token = jwt.sign(
  //     { id: user.id, role: user.role, name: user.name },
  //     process.env.JWT_SECRET as string,
  //     { expiresIn: '1d' }
  //   );

  //   delete user.password;
  //   res.json({ user, token });
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ message: 'Server error' });
  // }
    try {
    console.log("LOGIN REQUEST: ", { email });

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      console.log("No user found for email:", email);
       res.status(401).json({ message: 'Invalid credentials' });
       return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
       res.status(401).json({ message: 'Invalid credentials' });
       return
    }

    console.log("Password match. Creating JWT...");
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProfile = async (
  //  req: AuthenticatedRequest, 
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const result = await pool.query(
      'SELECT id, name, email, role, skills, seniority, max_capacity FROM users WHERE id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, skills, seniority } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, skills = $2, seniority = $3 WHERE id = $4 RETURNING id, name, email, role, skills, seniority, max_capacity`,
      [name, skills, seniority, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};