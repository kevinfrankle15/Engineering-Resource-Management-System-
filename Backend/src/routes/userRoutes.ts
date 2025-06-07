import { Router } from 'express';
import { getAllEngineers, getEngineerCapacity } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllEngineers);
router.get('/:id/capacity', verifyToken, getEngineerCapacity);

export default router;