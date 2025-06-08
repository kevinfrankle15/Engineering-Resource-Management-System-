import { Request, Response } from 'express';
import  {pool}  from '../db';

export const getEngineers = async (req: Request, res: Response): Promise<void>  => {
  const { skill, level, sortBy, order = 'asc', page = '1', limit = '10' } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  try {
    let query = 'SELECT * FROM engineers';
    const values: any[] = [];
    const conditions: string[] = [];

    if (skill) {
      values.push(`%${skill}%`);
      conditions.push(`skills ILIKE $${values.length}`);
    }
    if (level) {
      values.push(level);
      conditions.push(`level = $${values.length}`);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${order}`;
    }
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(parseInt(limit as string), offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const getEngineerById = async (req: Request, res: Response): Promise<void>  => {
  try {
    const result = await pool.query('SELECT * FROM engineers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
       res.status(404).json({ message: 'Engineer not found' });
       return
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const createEngineer = async (req: Request, res: Response): Promise<void>  => {
  const { name, level, skills } = req.body;
  if (!name || !level || !skills) {
     res.status(400).json({ error: 'Missing required fields' });
    return
  }
  try {
    const result = await pool.query(
      'INSERT INTO engineers (name, level, skills) VALUES ($1, $2, $3) RETURNING *',
      [name, level, skills]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const updateEngineer = async (req: Request, res: Response): Promise<void>  => {
  const { name, level, skills } = req.body;
  try {
    const result = await pool.query(
      'UPDATE engineers SET name = $1, level = $2, skills = $3 WHERE id = $4 RETURNING *',
      [name, level, skills, req.params.id]
    );
    if (result.rows.length === 0) {
       res.status(404).json({ message: 'Engineer not found' });
       return
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};

export const deleteEngineer = async (req: Request, res: Response): Promise<void>  => {
  try {
    const result = await pool.query('DELETE FROM engineers WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
       res.status(404).json({ message: 'Engineer not found' });
      return
    }
    res.json({ message: 'Engineer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err });
  }
};
