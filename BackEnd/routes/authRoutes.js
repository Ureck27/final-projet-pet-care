const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  adminLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const { validate } = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema, resetPasswordSchema } = require('../validators/authSchema');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/admin-login', validate(loginSchema), adminLogin);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
