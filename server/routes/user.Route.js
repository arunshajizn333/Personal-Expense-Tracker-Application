const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile} = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth.middleware')

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.put('/profile', verifyToken, updateProfile);


module.exports = router; 
