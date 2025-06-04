const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  displayName: String,
  email: String,
  birthPlace: String,
  birthDate: Date,
  phone: String,
  profileImage: String,
  created_at: { type: Date, default: Date.now },
  status: String
});
const User = mongoose.model('User', userSchema, 'user');

module.exports = { User };