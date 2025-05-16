const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { sendMessage, getMessageHistory } = require('../controllers/messages');

router.use(protect);

router.post('/', sendMessage);
router.get('/:roomId', getMessageHistory);

module.exports = router;