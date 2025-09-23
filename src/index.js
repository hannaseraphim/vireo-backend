const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors({origin: `${process.env.VIREO_FRONT_END}`, credentials: true}))
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.get('/status', (req,res) => {
    res.json({status: '200', type: 'Success', message: 'SERVER_ONLINE'})
})

try {   
    mongoose.connect(process.env.VIREO_MONGO_URI);
    console.log('Connected to database')
    app.listen(process.env.VIREO_PORT, () => {
});
} catch (err) {
    console.error(err)
}