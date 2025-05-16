const socketio = require('socket.io');
const User = require('../models/User');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

let io;

exports.initialize = (server) => {
  io = socketio(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Authenticate user via JWT (optional but recommended)
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        socket.userId = user._id; // Attach user ID to socket
      } catch (err) {
        socket.disconnect();
      }
    });

    // Join a room + update online status
    socket.on('joinRoom', async ({ roomId }) => {
      if (!socket.userId) return;

      socket.join(roomId);
      
      // Update user's online status
      await User.findByIdAndUpdate(socket.userId, { 
        online: true,
        lastSeen: null 
      });

      // Notify room about new user
      const user = await User.findById(socket.userId);
      io.to(roomId).emit('userJoined', user); // Broadcast to room
    });

    // Handle disconnect (update offline status)
    socket.on('disconnect', async () => {
      if (!socket.userId) return;

      await User.findByIdAndUpdate(socket.userId, { 
        online: false,
        lastSeen: Date.now()
      });

      console.log('Client disconnected');
    });

    // Handle sendMessage event and save message to DB
    socket.on('sendMessage', async (message) => {
      try {
        if (!message.content || !message.room || !socket.userId) return;

        const newMessage = new Message({
          content: message.content,
          sender: socket.userId,
          room: message.room,
        });

        await newMessage.save();

        io.to(message.room).emit('newMessage', newMessage);
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    });

    socket.on('typing', ({ roomId, username }) => {
      socket.to(roomId).emit('typing', username);
    });
  });
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
