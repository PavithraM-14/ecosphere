import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated',
    user: req.user,
  });
});

export default router;
