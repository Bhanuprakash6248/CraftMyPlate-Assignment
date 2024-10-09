const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const auth = require('../middleware/auth'); 
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config();

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });


    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, phone });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    
    const payload = {
      user: {
        id: user._id,  
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
    
    res.json({ token });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Get user profile (requires authentication)
router.get('/profile', auth, async (req, res) => {
  try { 

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
    console.log("-------------")
    console.log(req.json())

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Update user profile (requires authentication)
router.put('/profile', auth, async (req, res) => {
  const { name, email, phone, addresses } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { name, email, phone, addresses },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
