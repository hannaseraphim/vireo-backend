const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const axios = require('axios')

// Signup
async function signup(req, res) {
    try {
        const { accountName, nickName, email, passwordHash } = req.body;

        // Check if username is already in use
        const existingUser = await User.findOne({accountName})
        if(existingUser) return res.status(409).json({status: '409', type: 'Conflict', message: 'USERNAME_EXISTS'})

        // Check if email is already in use
        const existingEmail = await User.findOne({email})
        if(existingEmail) return res.status(409).json({status: '409', type: 'Conflict', message: 'EMAIL_EXISTS'})

        // Encrypt password before sending to database
        const hashedPassword = await bcrypt.hash(passwordHash, 10);
        const newUser = new User({
            accountName,
            nickName,
            email,
            passwordHash: hashedPassword
        });

        // Sign the access
        const token = jwt.sign({id: newUser._id}, process.env.VIREO_JWT_TOKEN, {expiresIn: '30d'});
        
        // User  connection information:
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
        const location = `${geoRes.data.city}, ${geoRes.data.country}`

        // Save connection to newUser, such as IP, Device and Location (Connected devices)
        // IP: 123.45.678.91
        // Device: Windows 10/11, Firefox/Chrome, etc
        // Location: City, Country
        newUser.connections.push({
            ip,
            device: userAgent,
            location
        });

        // Send info to database
        await newUser.save();
        res.status(201).json({status: '201', type: 'Success', message: 'User created successfully.', token, user: {
            id: newUser._id,
            accountName: newUser.accountName,
            nickName: newUser.nickName,
            email: newUser.email
        }});

    } catch (err) {
        res.status(500).json({status: '500', type: 'Internal error', message: 'An error occourred on the server side.'});
    }
}

// Login
async function login(req, res) {
    try {
        const {email, passwordHash} = req.body;

        // Checks if the email exists in the database
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({status: '404', type: 'Not found', message: 'USER_NOT_FOUND'});

        // Compares if the password is the same as the one in database
        const valid = await bcrypt.compare(passwordHash, user.passwordHash);
        if(!valid) return res.status(401).json({status: '401', type: 'Authentication', message: 'INCORRECT_PASSWORD'});

        // Sign the access
        const token = jwt.sign({id: user._id}, process.env.VIREO_JWT_TOKEN, {expiresIn: '30d'});

        res.json({token, user});
    } catch (err) {
        console.error(err)
        res.status(500).json({status: '500', type: 'Internal error', message: 'INTERNAL_ERROR'});
    }
}

module.exports = {signup, login}