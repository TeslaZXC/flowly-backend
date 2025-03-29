import express from 'express';
import { register, login, updateSocialNetworkData } from '../controllers/authController.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(register)); 
router.post('/login', asyncHandler(login)); 
router.post('/update', asyncHandler(updateSocialNetworkData)); 

export default router;