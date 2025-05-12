// backend/routes/transaction.route.js
const express = require('express');
const multer = require('multer');
// Import the new deleteTransaction controller function
const { addTransaction, getSummary, getAnalytics, importCSV, deleteTransaction } = require('../controllers/transController');
const verifyToken = require('../middleware/auth.middleware');
const { updateUserActivity } = require('../middleware/activityTracker');
const { checkUserActivity } = require('../middleware/inactivityCheck');
const Transaction = require('../models/transaction.model');

// Set up Multer storage for CSV file upload
const storage = multer.memoryStorage(); // Store file in memory (use diskStorage for large files)
const upload = multer({ storage });


const router = express.Router();

// Route to get all transactions for the logged-in user
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

// Route to add a new transaction
router.post('/add', verifyToken, addTransaction);

// Route to get summary (income, expense, balance)
router.get('/summary', verifyToken, getSummary);

// Route to get analytics (category-wise, monthly-wise)
router.get('/analytics', verifyToken, getAnalytics);

// Route to import transactions from CSV
router.post('/import', verifyToken, upload.single('file'), importCSV);

// === NEW ROUTE TO DELETE A TRANSACTION BY ID ===
// Use a parameter in the URL for the transaction ID
router.delete('/:id', verifyToken, deleteTransaction);
// ===============================================


module.exports = router;
