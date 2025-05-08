const User = require('../models/user.model');

const isUserInactive = (lastActivity) => {
  const oneHour = 60 * 60 * 1000;  // 1 hour in milliseconds
  return (Date.now() - new Date(lastActivity).getTime()) > oneHour;
};

const checkUserActivity = async (req, res, next) => {
  try {
    const userId = req.user.userId;  // Assuming userId is available in req.user

    // Find the user and check if they have been inactive for over 1 hour
    const user = await User.findById(userId);
    if (isUserInactive(user.lastActivity)) {
      return res.status(401).json({ message: 'Session expired due to inactivity' });
    }

    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(500).json({ message: 'Error checking inactivity', error: error.message });
  }
};

module.exports = { checkUserActivity };
