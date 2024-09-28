const express = require('express');
const router = express.Router();
const ctrlNews = require('../controller/news');
const authenticate = require('../middlewares/authenticate');

// router.use(authenticate);

router.get('/', ctrlNews.get);

router.get('/:id', ctrlNews.getById);

router.post('/', authenticate, ctrlNews.create);

// router.put('/:id', authenticate, ctrlNews.update);

router.patch('/:id', authenticate, ctrlNews.update);

router.delete('/:id', authenticate, ctrlNews.remove);

module.exports = router;