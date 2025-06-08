import { Request, Response } from 'express';
import  pool  from '../db';

export const getAllEngineers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, skills, seniority, max_capacity FROM users WHERE role = 'engineer'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch engineers' });
  }
};

export const getEngineerCapacity = async (req: Request, res: Response): Promise<void> => {
  const engineerId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.max_capacity,
         COALESCE(SUM(a.allocation_percentage), 0) AS allocated
       FROM users u
       LEFT JOIN assignments a ON u.id = a.engineer_id
       WHERE u.id = $1 AND u.role = 'engineer'
       GROUP BY u.id`,
      [engineerId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Engineer not found' });
      return;
    }

    const { max_capacity, allocated } = result.rows[0];
    const available = Math.max(0, max_capacity - allocated);
    res.json({ ...result.rows[0], available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch capacity' });
  }
};
