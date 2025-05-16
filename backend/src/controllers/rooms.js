const Room = require('../models/Room');
const User = require('../models/User');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    
    const room = new Room({
      name,
      isPrivate,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    await room.save();

    // Add room to user's joined rooms
    await User.findByIdAndUpdate(req.user.id, {
      $push: { rooms: room._id }
    });

    res.status(201).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Join a room
exports.joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    // Check if user is already a member
    if (room.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already in room' });
    }

    // Add user to room members
    room.members.push(req.user.id);
    await room.save();

    // Add room to user's joined rooms
    await User.findByIdAndUpdate(req.user.id, {
      $push: { rooms: room._id }
    });

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all public rooms
exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('createdBy', 'username avatar')
      .populate('members', 'username avatar online');
      
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get room details
exports.getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('members', 'username avatar online');

    if (!room) {
      return res.status(404).json({ msg: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};