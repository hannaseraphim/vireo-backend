const express = require('express');
const {signup, login} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, async (req, res) => {
    const token = req.cookies.vireoAccessCookie;

    await User.updateOne({_id: req.user.id}, {$pull: {connections: {token}}});

    res.clearCookie('vireoAccessCookie', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    res.json({message: 'Logged out successfully'})
})

module.exports = router;