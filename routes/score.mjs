import express from 'express';
import { listScore, createScore, getScores, updateScore, deleteScore } from '../controllers/scoreController.mjs';

const router = express.Router();

router.get('/', getScores);
router.get('/user', listScore); // Assuming this is for user-specific scores
router.post('/add', createScore);
router.post('/update/:id', updateScore);
router.post('/delete/:id', deleteScore);

export default router;
