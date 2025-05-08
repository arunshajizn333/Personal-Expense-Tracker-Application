const User = require('../models/user.model');

// Middleware to update the last activity timestamp
const updateUserActivity = async (req, res, next) => {
  try {
    const userId = req.user.userId;  // Assuming userId is stored in the request (e.g., after authentication)

    // Update the user's last activity
    await User.findByIdAndUpdate(userId, { lastActivity: Date.now() });
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(500).json({ message: 'Error updating activity', error: error.message });
  }
};

module.exports = { updateUserActivity };