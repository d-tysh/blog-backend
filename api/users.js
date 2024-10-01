const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controller/users');
const authenticate = require('../middlewares/authenticate');
const controllerWrapper = require('../decorators/controllerWrapper');

router
    .post('/login', controllerWrapper(ctrlUsers.login))
    .post('/register', express.json(), controllerWrapper(ctrlUsers.register))
    .post('/logout', authenticate, controllerWrapper(ctrlUsers.logout))
    .get('/current', authenticate, controllerWrapper(ctrlUsers.getCurrent))
    .get('/', authenticate, controllerWrapper(ctrlUsers.getAllUsers))
    .get('/:id', authenticate, controllerWrapper(ctrlUsers.getUserByid))
    .patch('/:id', authenticate, controllerWrapper(ctrlUsers.update))
    .delete('/:id', authenticate, controllerWrapper(ctrlUsers.remove));

module.exports = router;