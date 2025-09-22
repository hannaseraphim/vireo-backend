const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({origin: 'https://vireo-kappa.vercel.app'}))
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

try {   
    mongoose.connect(process.env.VIREO_MONGO_URI);
    console.log('Connected to database')
    app.listen(process.env.VIREO_PORT, () => {
});
} catch (err) {
    console.error(err)
}