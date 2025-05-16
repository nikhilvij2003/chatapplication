const Message = require('../models/Message');

// Send a message and save to DB
exports.sendMessage = async (req, res) => {
  try {
    const { content, room } = req.body;
    const sender = req.user.id;

    if (!content || !room) {
      return res.status(400).json({ msg: 'Content and room are required' });
    }

    const message = new Message({
      content,
      sender,
      room,
    });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get message history for a room
exports.getMessageHistory = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username avatar')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
