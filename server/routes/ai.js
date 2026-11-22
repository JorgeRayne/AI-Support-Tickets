import express from 'express';
import aiController from '../contorllers/aiController.js';

const ai = express.Router();

ai.post('/:id/analyze', aiController.createAiInteraction);

export default ai;