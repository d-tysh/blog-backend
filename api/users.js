import express from 'express';
import ctrlUsers from '../controller/users.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { userLoginSchema, userRegisterSchema, userUpdateSchema } from '../service/schemas/user.js';

const router = express.Router();

router
    .post('/login', validateBody(userLoginSchema), ctrlUsers.login)
    .post('/register', express.json(), validateBody(userRegisterSchema), ctrlUsers.register)
    .post('/logout', authenticate, ctrlUsers.logout)
    .get('/current', authenticate, ctrlUsers.getCurrent)
    .get('/', authenticate, ctrlUsers.getAllUsers)
    .get('/:id', authenticate, ctrlUsers.getUserByid)
    .patch('/:id', authenticate, validateBody(userUpdateSchema), ctrlUsers.update)
    .delete('/:id', authenticate, ctrlUsers.remove);

    export default router;