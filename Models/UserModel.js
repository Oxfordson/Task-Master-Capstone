const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Ensure no leading or trailing spaces in the username
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

module.exports = mongoose.model('User', UserSchema);
