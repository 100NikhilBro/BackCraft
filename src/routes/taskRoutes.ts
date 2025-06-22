import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validations/taskSchema';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from '../controllers/taskController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// All routes protected via authMiddleware ✅
router.post('/create', authMiddleware, validateRequest(createTaskSchema), createTask);
router.put('/update/:id', authMiddleware, validateRequest(updateTaskSchema), updateTask);
router.get('/get', authMiddleware, getTask);
router.get('/getAll', authMiddleware, getAllTasks);
router.delete('/delete/:id', authMiddleware, deleteTask);

export default router;
