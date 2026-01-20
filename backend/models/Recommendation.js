const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    state: String,
    district: String
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid'],
    required: true
  },
  recommendations: [{
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    cropName: String,
    suitabilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    yieldPrediction: {
      min: Number, // kg/hectare
      max: Number, // kg/hectare
      expected: Number // kg/hectare
    },
    explanation: {
      type: String,
      required: true
    },
    environmentalFactors: {
      soilMatch: Number,
      weatherMatch: Number,
      historicalYield: Number
    }
  }],
  environmentalSnapshot: {
    soil: {
      ph: Number,
      organicCarbon: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    },
    weather: {
      avgTemperature: Number,
      avgRainfall: Number,
      avgHumidity: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);


