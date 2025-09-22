const User = require('../models/User');

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        res.json(user);
    } catch (err) {
        res.status(500).json({status: '500', type: 'Internal error', message: 'An error occourred on the server side.'});
    }
}

module.exports = {getProfile};