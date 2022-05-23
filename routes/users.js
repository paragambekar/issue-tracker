const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport/lib');

const userController = require('../controllers/users-controller');


router.get('/sign-up',userController.signUp); 
router.get('/sign-in',userController.signIn);
router.get('/sign-out',userController.destroySession);


router.post('/create', userController.create);


// using passport js to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'}
) ,userController.createSession);

module.exports = router;