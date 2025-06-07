import express from 'express';
import {
  getEngineers,
  getEngineerById,
  createEngineer,
  updateEngineer,
  deleteEngineer,
} from '../controllers/engineerController';

const router = express.Router();

router.get('/', getEngineers);
router.get('/:id', getEngineerById);
router.post('/', createEngineer);
router.put('/:id', updateEngineer);
router.delete('/:id', deleteEngineer);

export default router;