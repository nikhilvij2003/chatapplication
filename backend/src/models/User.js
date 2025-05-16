const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true ,minlength: 6},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true ,minlength: 6},
  avatar: { type: String, default: 'https://i.imgur.com/abcdefg.png' },
  online: { type: Boolean, default: false },
  lastSeen: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
