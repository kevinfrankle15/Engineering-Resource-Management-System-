import { Request, Response } from 'express';
import { pool } from '../db';
import { log } from 'node:console';

export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');

    const projects = result.rows.map(project => ({
      _id: project.id.toString(),
      name: project.name,
      description: project.description,
      requiredSkills: project.required_skills,
      startDate: project.start_date,
      endDate: project.end_date,
      teamSize: project.team_size,
      status: project.status,
    }));

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};


export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, description, start_date, end_date, required_skills, team_size, status } = req.body;
   console.log(start_date, end_date)
  if (!name || !required_skills || !Array.isArray(required_skills)) {
    res.status(400).json({ message: 'Project name and required_skills (as array) are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects (name, description, start_date, end_date, required_skills, team_size, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, start_date, end_date, required_skills, team_size, status || 'planning']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, requiredSkills, status, teamSize, startDate, endDate } = req.body;
  console.log(startDate, endDate)
  try {
    const result = await pool.query(
      `UPDATE projects SET 
         name = $1,
         description = $2,
         required_skills = $3,
         status = $4,
         team_size = $5,
         start_date = $6,
         end_date = $7
       WHERE id = $8 RETURNING *`,
      [name, description, requiredSkills, status, teamSize,startDate, endDate, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return 
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM projects WHERE id = $1 RETURNING *`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Project not found' });
      return 
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};