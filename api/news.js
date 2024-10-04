import express from 'express';
import ctrlNews from '../controller/news.js';
import authenticate from '../middlewares/authenticate.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const router = express.Router();

router
    .get('/', controllerWrapper(ctrlNews.get))
    .get('/:id', controllerWrapper(ctrlNews.getById))
    .post('/', authenticate, controllerWrapper(ctrlNews.create))
    .patch('/:id', authenticate, controllerWrapper(ctrlNews.update))
    .delete('/:id', authenticate, controllerWrapper(ctrlNews.remove));

export default router;