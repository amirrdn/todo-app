import express from 'express';
import { authenticate } from '../middleware/auth';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = express.Router();

router.get('/', authenticate, getAllTasks);
router.post('/', authenticate, createTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);

export default router; 