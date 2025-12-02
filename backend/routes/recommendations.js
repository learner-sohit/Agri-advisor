const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getRecommendationHistory,
  getRecommendation
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', getRecommendations);
router.get('/', getRecommendationHistory);
router.get('/:id', getRecommendation);

module.exports = router;


