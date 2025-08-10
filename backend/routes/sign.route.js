import express from 'express';
import SignController from '../app/controllers/SignController.js';

const router = express.Router();

router.post('/signUp', SignController.register);
router.post('/signIn', SignController.login);

export default router;
