const express = require('express');
const router = express.Router();
const axios = require('axios');

// Your existing controllers
const {
  getRecommendations,
  getRecommendationHistory,
  getRecommendation
} = require('../controllers/recommendationController');

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// -------------------------------
// 1️⃣ OLD ROUTES
// -------------------------------
router.post('/', getRecommendations);
router.get('/', getRecommendationHistory);
router.get('/:id', getRecommendation);

// -------------------------------
// 2️⃣ NEW ML ROUTE (Fixed 404 + Fixed 422)
// -------------------------------

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

router.post('/generate', async (req, res) => {
  try {
    const body = req.body;

    // Validate minimal required fields
    if (!body.state || !body.district || !body.season) {
      return res.status(400).json({
        success: false,
        message: "state, district, and season are required"
      });
    }

    // Build ML request EXACTLY as FastAPI expects
    const mlPayload = {
      state: body.state,
      district: body.district,
      season: body.season,

      soil: {
        ph: body.soil?.ph ?? 7.0,
        organicCarbon: body.soil?.organicCarbon ?? 0.5,
        nitrogen: body.soil?.nitrogen ?? 100,
        phosphorus: body.soil?.phosphorus ?? 20,
        potassium: body.soil?.potassium ?? 150
      },

      weather: {
        avgTemperature: body.weather?.avgTemperature ?? 25,
        avgRainfall: body.weather?.avgRainfall ?? 800,
        avgHumidity: body.weather?.avgHumidity ?? 60
      }
    };

    console.log("📤 Sending to ML:", mlPayload);

    // Send request to FastAPI ML service
    const response = await axios.post(`${ML_URL}/predict`, mlPayload);

    return res.json({
      success: true,
      data: response.data
    });

  } catch (err) {
    console.error("❌ ML Service Error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to connect to ML service",
      error: err.response?.data || err.message
    });
  }
});

module.exports = router;
