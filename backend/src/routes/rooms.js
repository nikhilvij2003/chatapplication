const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  createRoom,
  joinRoom,
  getPublicRooms,
  getRoomDetails
} = require('../controllers/rooms');

// Protected routes (require JWT)
router.use(protect);

router.post('/', createRoom);
router.get('/', getPublicRooms);
router.get('/:id', getRoomDetails);
router.post('/:id/join', joinRoom);

module.exports = router;