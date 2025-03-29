import express from 'express';
import { parserCommunities } from '../controllers/parserCommunities.js';
import { parserRecommednation } from '../controllers/parserRecommednation.js';
import { handleParser } from '../controllers/handleParser.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/', asyncHandler(parserCommunities)); 
router.get('/parserRecommednation', asyncHandler(parserRecommednation)); 
router.get('/all,', asyncHandler(handleParser))

export default router;