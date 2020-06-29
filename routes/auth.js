const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),

    authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',
    check('email')
        .isEmail()
        .withMessage("Please Enter Valid Email")
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'E-mail exists already, please pick a different one.'
                    );
                }
            });
        })
        .normalizeEmail(),
    // We can just add a message so the we dont have to keep adding withMessage
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        }),
    authController.postSignup);

router.get("/logout", authController.postlogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password',
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .isLength({ min: 5 })
        .isAlphanumeric(), authController.postNewPassword);

module.exports = router;