const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('admin/auth/login'));
router.get('/register', (req, res) => res.render('admin/auth/register'));
router.get('/reset-password', (req, res) => res.render('admin/auth/reset-password'));

module.exports = router;

