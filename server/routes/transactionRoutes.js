const express = require('express');
const multer = require('multer');
const { addTransaction, getSummary, getAnalytics, importCSV } = require('../controllers/transController');
const verifyToken = require('../middleware/auth.middleware');
const { updateUserActivity } = require('../middleware/activityTracker');
const { checkUserActivity } = require('../middleware/inactivityCheck');
const Transaction = require('../models/transaction.model'); 

// Set up Multer storage for CSV file upload
const storage = multer.memoryStorage(); // Store file in memory (use diskStorage for large files)
const upload = multer({ storage });


const router = express.Router();

router.get('/transactions', verifyToken, async (req, res) => {
  try {
    console.log('User from token:', req.user); // Log to confirm user is set
    const userId = req.user.userId;
    const transactions = await Transaction.find({ userId });
    res.status(200).json(transactions);
  } catch (error) {
    console.log('Error retrieving transactions:', error);
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
});



  // CSV Import Route
router.post('/import', verifyToken, upload.single('file'), importCSV);

  

router.post('/add', verifyToken, addTransaction);
router.get('/summary', verifyToken, getSummary);
router.get('/analytics', verifyToken, getAnalytics);

module.exports = router;
