import express from 'express';
import ctrlUsers from '../controller/users.js';
import authenticate from '../middlewares/authenticate.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { userLoginSchema, userRegisterSchema, userUpdateSchema } from '../service/schemas/user.js';

const router = express.Router();

router
    .post('/login', validateBody(userLoginSchema), controllerWrapper(ctrlUsers.login))
    .post('/register', express.json(), validateBody(userRegisterSchema), controllerWrapper(ctrlUsers.register))
    .post('/logout', authenticate, controllerWrapper(ctrlUsers.logout))
    .get('/current', authenticate, controllerWrapper(ctrlUsers.getCurrent))
    .get('/', authenticate, controllerWrapper(ctrlUsers.getAllUsers))
    .get('/:id', authenticate, controllerWrapper(ctrlUsers.getUserByid))
    .patch('/:id', authenticate, validateBody(userUpdateSchema), controllerWrapper(ctrlUsers.update))
    .delete('/:id', authenticate, controllerWrapper(ctrlUsers.remove));

export default router;