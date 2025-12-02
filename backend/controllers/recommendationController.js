const axios = require('axios');
const Location = require('../models/Location');
const Crop = require('../models/Crop');
const Recommendation = require('../models/Recommendation');

// @desc    Get crop recommendations
// @route   POST /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { state, district, season } = req.body;
    const userId = req.user.id;

    if (!state || !district || !season) {
      return res.status(400).json({ message: 'Please provide state, district, and season' });
    }

    // Fetch location data with environmental information
    let location = await Location.findOne({ state, district });
    
    if (!location) {
      return res.status(404).json({ 
        message: 'Location data not found. Please ensure data has been processed for this district.' 
      });
    }

    // Prepare features for ML service
    const features = {
      state,
      district,
      season,
      soil: {
        ph: location.soilData.ph.mean,
        organicCarbon: location.soilData.organicCarbon.mean,
        nitrogen: location.soilData.nitrogen.mean,
        phosphorus: location.soilData.phosphorus.mean,
        potassium: location.soilData.potassium.mean
      },
      weather: {
        avgTemperature: location.weatherData.avgTemperature.mean,
        avgRainfall: location.weatherData.avgRainfall.mean,
        avgHumidity: location.weatherData.avgHumidity.mean
      }
    };

    // Call ML service
    let mlResponse;
    try {
      mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        features,
        { timeout: 10000 }
      );
    } catch (error) {
      console.error('ML Service Error:', error.message);
      return res.status(503).json({ 
        message: 'ML service unavailable. Please try again later.',
        error: error.message 
      });
    }

    const predictions = mlResponse.data.recommendations || [];
    
    // Enrich with crop details
    const recommendations = await Promise.all(
      predictions.map(async (pred) => {
        const crop = await Crop.findOne({ name: pred.cropName });
        return {
          crop: crop?._id,
          cropName: pred.cropName,
          suitabilityScore: pred.suitabilityScore,
          yieldPrediction: pred.yieldPrediction,
          explanation: pred.explanation,
          environmentalFactors: pred.environmentalFactors
        };
      })
    );

    // Create environmental snapshot
    const environmentalSnapshot = {
      soil: {
        ph: location.soilData.ph.mean,
        organicCarbon: location.soilData.organicCarbon.mean,
        nitrogen: location.soilData.nitrogen.mean,
        phosphorus: location.soilData.phosphorus.mean,
        potassium: location.soilData.potassium.mean
      },
      weather: {
        avgTemperature: location.weatherData.avgTemperature.mean,
        avgRainfall: location.weatherData.avgRainfall.mean,
        avgHumidity: location.weatherData.avgHumidity.mean
      }
    };

    // Save recommendation history
    const recommendation = await Recommendation.create({
      user: userId,
      location: { state, district },
      season,
      recommendations,
      environmentalSnapshot
    });

    res.json({
      success: true,
      recommendations,
      environmentalSnapshot,
      recommendationId: recommendation._id
    });
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommendation history
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendationHistory = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user.id })
      .populate('recommendations.crop')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single recommendation
// @route   GET /api/recommendations/:id
// @access  Private
exports.getRecommendation = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('recommendations.crop')
      .populate('user', 'name email');

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns this recommendation or is admin
    if (recommendation.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


