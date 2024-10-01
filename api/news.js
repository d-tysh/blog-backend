const express = require('express');
const router = express.Router();
const ctrlNews = require('../controller/news');
const authenticate = require('../middlewares/authenticate');
const controllerWrapper = require('../decorators/controllerWrapper');

router
    .get('/', controllerWrapper(ctrlNews.get))
    .get('/:id', controllerWrapper(ctrlNews.getById))
    .post('/', authenticate, controllerWrapper(ctrlNews.create))
    .patch('/:id', authenticate, controllerWrapper(ctrlNews.update))
    .delete('/:id', authenticate, controllerWrapper(ctrlNews.remove));

module.exports = router;