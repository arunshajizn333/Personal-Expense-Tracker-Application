const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating authentication tokens
const User = require('../models/user.model'); // User model

// =========================
// Register a new user
// =========================
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if all required fields are provided
    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const normalizedEmail = email.toLowerCase(); // Normalize email for consistency

    // Check if the user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'email already exists!' });
    }

    // Password Strength Validation (Optional)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain at least one letter and one number.' });
    }

    // Hash the user's password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      userName,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: 'Something went wrong. Please try again later.' });
  }
};

// =========================
// Login a user
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    const normalizedEmail = email.toLowerCase(); // Normalize email
    const user = await User.findOne({ email: normalizedEmail });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT token with 1 hour expiration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token and user info (excluding password)
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: 'Something went wrong. Please try again later.' });
  }
};

// =========================
// Update a user profile
// =========================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // From the JWT middleware
    const { userName, email } = req.body;

    if (!userName && !email) {
      return res.status(400).json({ message: 'At least one field (username or email) is required' });
    }

    const updatedFields = {};
    if (userName) updatedFields.userName = userName;
    if (email) updatedFields.email = email.toLowerCase(); // Normalize email

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    ).select('-password'); // Exclude password from response

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: 'Something went wrong. Please try again later.' });
  }
};

module.exports = { registerUser, loginUser, updateProfile };
