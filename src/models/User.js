const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  ip: String,
  device: String,
  location: String,
  timestamp: {type: Date, default: Date.now}
})

const userSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  nickName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false},
  isVerified: {type: Boolean, default: false},
  isBanned: { type: Boolean, default: false },
  preferedTheme: { type: String, enum: ['light', 'dark', 'amelia'], default: 'dark'},
  connections: [connectionSchema],
});

module.exports = mongoose.model('User', userSchema);