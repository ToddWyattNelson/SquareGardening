const express = require('express');
const isAuth = require('../middleware/is-auth');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get("/logout", authController.postlogout);

module.exports = router;