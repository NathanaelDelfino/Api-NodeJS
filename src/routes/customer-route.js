'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');

router.get('/', controller.get);
router.post('/authenticate', controller.authenticate);
router.post('/', controller.post);
router.delete('/:id', controller.deleteById);

module.exports = router;