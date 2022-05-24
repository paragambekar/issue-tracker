const express = require('express');
const router = express.Router();
const passport = require('passport');
const { authenticate } = require('passport/lib');

const projectController = require('../controllers/projects-controller');


router.post('/create', projectController.create);

router.get('/:projectId', projectController.project)
router.post('/:projectId', projectController.createIssue);

router.get('/', projectController.redirects);
module.exports = router; 
