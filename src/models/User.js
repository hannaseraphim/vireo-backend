const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  ip: String,
  device: String,
  location: String,
  token: String,
  timestamp: {type: Date, default: Date.now}
})

const badgeSchema = new mongoose.Schema({
  badgeName: {type: String},
  badgeDescription: {type: String},
  badgeIcon: {type: String},
  badgeType: {type: String},
  givenAt: {type: Date, default: Date.now},
  givenBy: {type: String}
})

const friendsSchema = new mongoose.Schema({
  friendId: {type: String},
  addedIn: {type: Date, default: Date.now}
})

const accDetailsSchema = new mongoose.Schema({
  profilePictureUrl:  {type: String },
  profilePictureType: {type: String, default: 'png' },
  profileDescription: {type: String },
  profileBannerUrl:   {type: String },
  profileBannerType:  {type: String, default: 'png' },
  profilePronouns:    {type: String },
  profileBadges:      [badgeSchema]
})

const userSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  accountDetails: [accDetailsSchema],
  nickName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false},
  isVerified: {type: Boolean, default: false},
  isBanned: { type: Boolean, default: false },
  preferedTheme: { type: String, enum: ['light', 'dark', 'amelia'], default: 'dark'},
  connections: [connectionSchema],
  revokedTokens: [],
  friends: [friendsSchema]
});

module.exports = mongoose.model('User', userSchema);