const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controller/users');
const authenticate = require('../middlewares/authenticate');
// const upload = require('../middlewares/upload');

router.post('/login', ctrlUsers.login);

router.post('/register', express.json(), ctrlUsers.register);

router.post('/logout', authenticate, ctrlUsers.logout);

router.get('/current', authenticate, ctrlUsers.getCurrent);

router.get('/', authenticate, ctrlUsers.getAllUsers);

router.get('/:id', authenticate, ctrlUsers.getUserByid);

router.patch('/:id', authenticate, ctrlUsers.update);

router.delete('/:id', authenticate, ctrlUsers.remove);

// router.patch('/avatars', authenticate, upload.single('avatarURL'), ctrlUsers.updateAvatar);

module.exports = router;