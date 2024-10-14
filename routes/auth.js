const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // Mongoose User model

const router = express.Router();

// Register User
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('mobileNumber', 'Please include a valid mobile number').isMobilePhone(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  check('name', 'Name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, mobileNumber, password } = req.body;

  try {
    // Check if user already exists by email or mobile number
    let user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
      return res.status(400).json({ msg: 'User with this email or mobile number already exists' });
    }

    user = new User({ name, email, mobileNumber, password });

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'yourSecretKey', { expiresIn: '30d' }, (err, token) => {
      if (err) throw err;
      res.json({ token }); // Return the JWT token
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login User
router.post('/login', async (req, res) => {
    const { emailOrMobile, password } = req.body;
  
    try {
      // Find user by email or mobile number
      let user = await User.findOne({
        $or: [
          { email: emailOrMobile },
          { mobileNumber: emailOrMobile }
        ]
      });
  
      if (!user) {
        return res.status(400).json({ msg: 'User not registered' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Password' });
      }
  
      // Generate JWT token
      const payload = { user: { id: user.id } };
      jwt.sign(payload, 'yourSecretKey', { expiresIn: '30d' }, (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send JWT token to client
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
