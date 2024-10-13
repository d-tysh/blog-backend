import express from 'express';
import ctrlNews from '../controller/news.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { newsCreateSchema, newsUpdateSchema } from '../service/schemas/news.js';

const router = express.Router();

router
    .get('/', ctrlNews.get)
    .get('/:id', ctrlNews.getById)
    .post('/', authenticate, validateBody(newsCreateSchema), ctrlNews.create)
    .patch('/:id', authenticate, validateBody(newsUpdateSchema), ctrlNews.update)
    .delete('/:id', authenticate, ctrlNews.remove);
    
export default router;