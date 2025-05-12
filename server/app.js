const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4300'], // Angular dev server
    credentials: true
  }));
  

const PORT = process.env.PORT;

// Import and use routes directly
const userRouter = require('./routes/user.Route'); 
const transactionRouter = require('./routes/transactionRoutes'); 

app.use('/user', userRouter);  
app.use('/transactions', transactionRouter);  // ✅ Correctly attached to app

// Start server
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server running successfully on PORT:", PORT);
    } else {
        console.log("An error occurred:", error);
    }
});

// MongoDB connection
async function main() {
    try {
        await mongoose.connect(process.env.ConnectionString);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
main();
