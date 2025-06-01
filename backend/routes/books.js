import express from 'express';
import {saveBook, recommendBooks } from '../controllers/bookController.js';

const router = express.Router();

router.post('/recommend', recommendBooks);  // <-- Change GET to POST
router.post('/save', saveBook); // New route for saving bookmark

export default router;
