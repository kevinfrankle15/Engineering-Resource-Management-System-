// import { Router } from 'express';
// import { assignEngineer, getAssignments } from '../controllers/assignmentController';
// import { verifyToken } from '../middleware/authMiddleware';

// const router = Router();

// router.get('/', verifyToken, getAssignments);
// router.post('/', verifyToken, assignEngineer);

// export default router;

// import { Router } from 'express';
// import {
//   getAllAssignments,
//   createAssignment,
//   deleteAssignment,
//   updateAssignment
// } from '../controllers/assignmentController';
// import { verifyToken } from '../middleware/authMiddleware';

// const router = Router();

// router.get('/', verifyToken, getAllAssignments);
// router.post('/', verifyToken, createAssignment);
// router.delete('/:id', verifyToken, deleteAssignment);
// router.put('/:id', verifyToken, updateAssignment); 

// export default router;


import { Router } from 'express';
import {
  getAssignments,
  assignEngineer,
  
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAssignments);
router.post('/', verifyToken, assignEngineer);
router.put('/:id', verifyToken, updateAssignment);
router.delete('/:id', verifyToken, deleteAssignment);

export default router;

