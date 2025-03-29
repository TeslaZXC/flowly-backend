import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(register)); 
router.post('/login', asyncHandler(login)); 

export default router;