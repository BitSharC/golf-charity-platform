import express from 'express';
import { getCharities } from '../controllers/charityController.js';

const router = express.Router();
router.get('/', getCharities);

export default router;
