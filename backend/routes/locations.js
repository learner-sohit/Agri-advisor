const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get states
// @route   GET /api/locations/states
// @access  Public
router.get('/states', async (req, res) => {
  try {
    // In production, this would come from a database or API
    const states = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];
    res.json({
      success: true,
      states
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get districts by state
// @route   GET /api/locations/districts/:state
// @access  Public
router.get('/districts/:state', async (req, res) => {
  try {
    // In production, this would query from database
    // For now, return sample districts
    const districts = [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'
    ];
    res.json({
      success: true,
      state: req.params.state,
      districts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


