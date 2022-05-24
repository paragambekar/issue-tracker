const express = require('express');
const { appendFile } = require('fs');
const router = express.Router();
const homeController = require('../controllers/home-controller');

console.log('Router Loaded');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/projects', require('./projects'));

module.exports = router;