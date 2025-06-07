import { Router } from 'express';
import { getAllProjects, createProject, updateProject ,deleteProject} from '../controllers/projectController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllProjects);
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);  
router.delete('/:id', verifyToken, deleteProject); 


export default router;