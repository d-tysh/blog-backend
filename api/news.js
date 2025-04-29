import express from 'express';
import ctrlNews from '../controller/news.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { addCommentSchema, newsCreateSchema, newsUpdateSchema } from '../service/schemas/news.js';

const router = express.Router();

router
    .get('/', ctrlNews.get)
    .get('/id/:id', ctrlNews.getById)
    .get('/:url', ctrlNews.getByURL)
    .post('/', authenticate, validateBody(newsCreateSchema), ctrlNews.create)
    .patch('/:id', authenticate, validateBody(newsUpdateSchema), ctrlNews.update)
    .patch('/:id/comment', authenticate, validateBody(addCommentSchema), ctrlNews.addComment)
    .delete('/:id', authenticate, ctrlNews.remove);
    
export default router;