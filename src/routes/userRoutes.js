const express = require('express');
const {getProfile} = require('../controllers/userController');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

module.exports = router;