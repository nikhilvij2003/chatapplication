const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
  avatar: { type: String, default: 'https://i.imgur.com/abcdefg.png' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);