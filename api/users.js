import express from 'express';
import ctrlUsers from '../controller/users.js';
import authenticate from '../middlewares/authenticate.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const router = express.Router();

router
    .post('/login', controllerWrapper(ctrlUsers.login))
    .post('/register', express.json(), controllerWrapper(ctrlUsers.register))
    .post('/logout', authenticate, controllerWrapper(ctrlUsers.logout))
    .get('/current', authenticate, controllerWrapper(ctrlUsers.getCurrent))
    .get('/', authenticate, controllerWrapper(ctrlUsers.getAllUsers))
    .get('/:id', authenticate, controllerWrapper(ctrlUsers.getUserByid))
    .patch('/:id', authenticate, controllerWrapper(ctrlUsers.update))
    .delete('/:id', authenticate, controllerWrapper(ctrlUsers.remove));

export default router;