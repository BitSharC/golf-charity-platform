import express from 'express';
import { addScore, getUserScores } from '../controllers/scoreController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// POST /api/scores
router.post('/', requireAuth, addScore);

// GET /api/scores/:userId
router.get('/:userId', requireAuth, getUserScores);

export default router;
