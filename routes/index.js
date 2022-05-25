const express = require('express');
const { appendFile } = require('fs');
const router = express.Router();
const homeController = require('../controllers/home-controller');

console.log('Router Loaded'); 

 
router.use('/users', require('./users'));
router.use('/projects', require('./projects'));
router.get('/', homeController.home);

module.exports = router;