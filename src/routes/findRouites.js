import express from 'express';
import { parserCommunities } from '../controllers/parserVK.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(parserCommunities)); 

export default router;