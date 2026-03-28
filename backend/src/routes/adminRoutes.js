import express from 'express';
import { runDraw } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();
router.post('/draw', requireAuth, requireAdmin, runDraw);

export default router;
