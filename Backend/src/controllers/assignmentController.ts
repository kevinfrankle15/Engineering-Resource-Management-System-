
// import { Request, Response } from 'express';
// import { pool } from '../db';

// export const getAssignments = async (_req: Request, res: Response): Promise<void>=> {
//   try {
//     const result = await pool.query('SELECT * FROM assignments');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch assignments' });
//   }
// };

// export const assignEngineer = async (req: Request, res: Response): Promise<void> => {
//   const {
//     engineerId,
//     projectId,
//     allocationPercentage,
//     startDate,
//     endDate,
//     role,
//   } = req.body;

//   if (!engineerId || !projectId || !allocationPercentage || !role) {
//     res.status(400).json({ message: 'Missing required fields' });
//     return
//   }

//   try {
//     const result = await pool.query(
//       `INSERT INTO assignments 
//         (engineer_id, project_id, allocation_percentage, start_date, end_date, role)
//        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
//       [engineerId, projectId, allocationPercentage, startDate, endDate, role]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to create assignment' });
//   }
// };

// export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const {
//     allocationPercentage,
//     role,
//     startDate,
//     endDate
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE assignments SET 
//         allocation_percentage = $1, 
//         role = $2,
//         start_date = $3,
//         end_date = $4
//       WHERE id = $5 RETURNING *`,
//       [allocationPercentage, role, startDate, endDate, id]
//     );

//     if (result.rows.length === 0) {
//       res.status(404).json({ message: 'Assignment not found' });
//       return 
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to update assignment' });
//   }
// };

// export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       'DELETE FROM assignments WHERE id = $1 RETURNING *',
//       [id]
//     );

//     if (result.rowCount === 0) {
//       res.status(404).json({ message: 'Assignment not found' });
//       return
//     }

//     res.json({ message: 'Assignment deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to delete assignment' });
//   }
// };


import { Request, Response } from 'express';
import  {pool}  from '../db';

export const getAssignments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM assignments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

export const assignEngineer = async (req: Request, res: Response): Promise<void> => {
  const {
    engineerId,
    projectId,
    allocationPercentage,
    startDate,
    endDate,
    role,
  } = req.body;

  if (!engineerId || !projectId || !allocationPercentage || !role || !startDate || !endDate) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO assignments 
        (engineer_id, project_id, allocation_percentage, start_date, end_date, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        engineerId,
        projectId,
        allocationPercentage,
        startDate, 
        endDate,
        role,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(' Failed to create assignment:', err);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

export const updateAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    allocationPercentage,
    role,
    startDate,
    endDate,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE assignments SET 
        allocation_percentage = $1,
        role = $2,
        start_date = $3,
        end_date = $4
       WHERE id = $5
       RETURNING *`,
      [allocationPercentage, role, startDate, endDate, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(' Failed to update assignment:', err);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};



export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM assignments WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error(' Failed to delete assignment:', err);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
};
