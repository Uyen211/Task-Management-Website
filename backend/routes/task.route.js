import express from 'express';
import authenticate from '../middleware/authenticate.js';
import TaskController from '../app/controllers/TaskController.js';

const router = express.Router();

router.get('/', authenticate, TaskController.getTasks);
router.post('/', authenticate, TaskController.createTask);
router.patch('/:id', authenticate, TaskController.editTask);
router.delete('/:id', authenticate, TaskController.deleteTask);

export default router;
