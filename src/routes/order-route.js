'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-services');


router.get('/',  authService.authorize, controller.get);
router.post('/', authService.authorize,  controller.post);
router.delete('/:id', authService.authorize, controller.deleteById);
module.exports = router;