const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  initiateConversation,
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.post('/conversation', initiateConversation);

module.exports = router;
