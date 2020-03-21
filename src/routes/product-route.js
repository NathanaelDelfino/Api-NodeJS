'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller')
const authService = require('../services/auth-services')

router.get('/', controller.get);
router.get('/:slug', controller.getBySlug);
router.get('/id/:id', controller.getById);
router.get('/tags/:tag', controller.getByTag);
router.post('/', authService.isAdmin, controller.post);
router.put('/:id',authService.isAdmin, controller.put);
router.delete('/:id',authService.isAdmin, controller.deleteById);
router.delete('/slug/:slug', controller.deleteBySlug);
module.exports = router;