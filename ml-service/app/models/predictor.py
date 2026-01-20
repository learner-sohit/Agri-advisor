"""
Crop Prediction Model
This module contains the ML model for crop recommendations.
In production, this would load a trained model from disk.
For now, it provides a rule-based prediction system as a placeholder.
"""
import numpy as np
from typing import List, Dict
import os

class CropPredictor:
    """
    Crop recommendation predictor.
    Uses rule-based logic as a placeholder for actual ML model.
    """
    
    def __init__(self, model_path: str = None):
        self.model_path = model_path or os.getenv('MODEL_PATH', './models/crop_model.pkl')
        self.crops = self._load_crop_database()
        
    def _load_crop_database(self) -> Dict:
        """
        Load crop database with ideal conditions.
        In production, this would come from a database or config file.
        """
        return {
            'Rice': {
                'season': ['Kharif'],
                'ph_range': (5.5, 7.0),
                'temp_range': (20, 35),
                'rainfall_range': (1000, 2500),
                'nitrogen_range': (80, 150),
                'phosphorus_range': (15, 30),
                'potassium_range': (100, 200),
                'base_yield': 3000
            },
            'Wheat': {
                'season': ['Rabi'],
                'ph_range': (6.0, 7.5),
                'temp_range': (15, 25),
                'rainfall_range': (400, 800),
                'nitrogen_range': (100, 180),
                'phosphorus_range': (20, 40),
                'potassium_range': (120, 220),
                'base_yield': 3500
            },
            'Maize': {
                'season': ['Kharif', 'Rabi'],
                'ph_range': (5.5, 7.5),
                'temp_range': (18, 30),
                'rainfall_range': (600, 1200),
                'nitrogen_range': (120, 200),
                'phosphorus_range': (25, 45),
                'potassium_range': (150, 250),
                'base_yield': 4000
            },
            'Cotton': {
                'season': ['Kharif'],
                'ph_range': (5.5, 8.0),
                'temp_range': (21, 30),
                'rainfall_range': (500, 1000),
                'nitrogen_range': (80, 150),
                'phosphorus_range': (15, 35),
                'potassium_range': (100, 200),
                'base_yield': 500
            },
            'Sugarcane': {
                'season': ['Kharif', 'Rabi'],
                'ph_range': (6.0, 7.5),
                'temp_range': (20, 32),
                'rainfall_range': (1200, 2000),
                'nitrogen_range': (150, 250),
                'phosphorus_range': (30, 60),
                'potassium_range': (200, 350),
                'base_yield': 70000
            },
            'Soybean': {
                'season': ['Kharif'],
                'ph_range': (6.0, 7.0),
                'temp_range': (20, 30),
                'rainfall_range': (600, 1000),
                'nitrogen_range': (50, 100),
                'phosphorus_range': (20, 40),
                'potassium_range': (100, 200),
                'base_yield': 2000
            },
            'Groundnut': {
                'season': ['Kharif', 'Rabi'],
                'ph_range': (5.5, 7.0),
                'temp_range': (24, 33),
                'rainfall_range': (500, 900),
                'nitrogen_range': (40, 80),
                'phosphorus_range': (15, 30),
                'potassium_range': (80, 150),
                'base_yield': 2500
            },
            'Potato': {
                'season': ['Rabi'],
                'ph_range': (5.0, 6.5),
                'temp_range': (15, 20),
                'rainfall_range': (300, 600),
                'nitrogen_range': (100, 200),
                'phosphorus_range': (30, 60),
                'potassium_range': (150, 300),
                'base_yield': 25000
            }
        }
    
    def _calculate_suitability_score(self, crop_data: Dict, features: Dict) -> float:
        """
        Calculate suitability score (0-100) based on how well conditions match crop requirements.
        """
        score = 100.0
        
        # Season match (critical)
        if features['season'] not in crop_data['season']:
            return 0.0
        
        # pH match
        ph = features['soil_ph']
        ph_min, ph_max = crop_data['ph_range']
        if ph < ph_min or ph > ph_max:
            score -= 20
        else:
            ph_optimal = (ph_min + ph_max) / 2
            ph_deviation = abs(ph - ph_optimal) / (ph_max - ph_min)
            score -= ph_deviation * 10
        
        # Temperature match
        temp = features['avg_temperature']
        temp_min, temp_max = crop_data['temp_range']
        if temp < temp_min or temp > temp_max:
            score -= 25
        else:
            temp_optimal = (temp_min + temp_max) / 2
            temp_deviation = abs(temp - temp_optimal) / (temp_max - temp_min)
            score -= temp_deviation * 15
        
        # Rainfall match
        rainfall = features['avg_rainfall']
        rainfall_min, rainfall_max = crop_data['rainfall_range']
        if rainfall < rainfall_min or rainfall > rainfall_max:
            score -= 20
        else:
            rainfall_optimal = (rainfall_min + rainfall_max) / 2
            rainfall_deviation = abs(rainfall - rainfall_optimal) / (rainfall_max - rainfall_min)
            score -= rainfall_deviation * 10
        
        # Soil nutrients match
        nitrogen = features['soil_nitrogen']
        n_min, n_max = crop_data['nitrogen_range']
        if n_min <= nitrogen <= n_max:
            score += 5
        
        phosphorus = features['soil_phosphorus']
        p_min, p_max = crop_data['phosphorus_range']
        if p_min <= phosphorus <= p_max:
            score += 5
        
        potassium = features['soil_potassium']
        k_min, k_max = crop_data['potassium_range']
        if k_min <= potassium <= k_max:
            score += 5
        
        return max(0, min(100, score))
    
    def _predict_yield(self, crop_data: Dict, features: Dict, suitability_score: float) -> Dict:
        """
        Predict yield range based on crop base yield and suitability.
        """
        base_yield = crop_data['base_yield']
        
        # Adjust yield based on suitability score
        yield_multiplier = suitability_score / 100
        
        # Add some variation
        expected = base_yield * yield_multiplier
        min_yield = expected * 0.8
        max_yield = expected * 1.2
        
        return {
            'min': round(min_yield, 2),
            'max': round(max_yield, 2),
            'expected': round(expected, 2)
        }
    
    def _generate_explanation(self, crop_name: str, crop_data: Dict, features: Dict, score: float) -> str:
        """
        Generate human-readable explanation for the recommendation.
        """
        explanations = []
        
        if score >= 80:
            explanations.append(f"{crop_name} is highly suitable for your location.")
        elif score >= 60:
            explanations.append(f"{crop_name} is suitable for your location.")
        else:
            explanations.append(f"{crop_name} is moderately suitable for your location.")
        
        # Season
        if features['season'] in crop_data['season']:
            explanations.append(f"It is ideal for {features['season']} season.")
        
        # Temperature
        temp = features['avg_temperature']
        temp_min, temp_max = crop_data['temp_range']
        if temp_min <= temp <= temp_max:
            explanations.append(f"Temperature conditions ({temp}°C) are optimal.")
        
        # Rainfall
        rainfall = features['avg_rainfall']
        rainfall_min, rainfall_max = crop_data['rainfall_range']
        if rainfall_min <= rainfall <= rainfall_max:
            explanations.append(f"Rainfall ({rainfall}mm) is within ideal range.")
        
        # Soil pH
        ph = features['soil_ph']
        ph_min, ph_max = crop_data['ph_range']
        if ph_min <= ph <= ph_max:
            explanations.append(f"Soil pH ({ph:.1f}) is suitable.")
        
        return " ".join(explanations)
    
    def _calculate_environmental_factors(self, crop_data: Dict, features: Dict) -> Dict:
        """
        Calculate individual environmental factor matches.
        """
        # Soil match
        soil_score = 0
        ph = features['soil_ph']
        ph_min, ph_max = crop_data['ph_range']
        if ph_min <= ph <= ph_max:
            soil_score += 50
        
        n = features['soil_nitrogen']
        n_min, n_max = crop_data['nitrogen_range']
        if n_min <= n <= n_max:
            soil_score += 20
        
        p = features['soil_phosphorus']
        p_min, p_max = crop_data['phosphorus_range']
        if p_min <= p <= p_max:
            soil_score += 15
        
        k = features['soil_potassium']
        k_min, k_max = crop_data['potassium_range']
        if k_min <= k <= k_max:
            soil_score += 15
        
        # Weather match
        weather_score = 0
        temp = features['avg_temperature']
        temp_min, temp_max = crop_data['temp_range']
        if temp_min <= temp <= temp_max:
            weather_score += 50
        
        rainfall = features['avg_rainfall']
        rainfall_min, rainfall_max = crop_data['rainfall_range']
        if rainfall_min <= rainfall <= rainfall_max:
            weather_score += 50
        
        # Historical yield (placeholder - would use actual historical data)
        historical_yield = 70  # Placeholder
        
        return {
            'soilMatch': round(min(100, soil_score), 1),
            'weatherMatch': round(min(100, weather_score), 1),
            'historicalYield': historical_yield
        }
    
    def predict(self, features: Dict) -> List[Dict]:
        """
        Predict top crop recommendations for given features.
        
        Args:
            features: Dictionary containing location and environmental data
            
        Returns:
            List of crop recommendations with scores and yield predictions
        """
        recommendations = []
        
        for crop_name, crop_data in self.crops.items():
            # Calculate suitability score
            score = self._calculate_suitability_score(crop_data, features)
            
            # Skip crops with very low suitability
            if score < 30:
                continue
            
            # Predict yield
            yield_pred = self._predict_yield(crop_data, features, score)
            
            # Generate explanation
            explanation = self._generate_explanation(crop_name, crop_data, features, score)
            
            # Calculate environmental factors
            env_factors = self._calculate_environmental_factors(crop_data, features)
            
            recommendations.append({
                'cropName': crop_name,
                'suitabilityScore': round(score, 1),
                'yieldPrediction': yield_pred,
                'explanation': explanation,
                'environmentalFactors': env_factors
            })
        
        # Sort by suitability score (descending)
        recommendations.sort(key=lambda x: x['suitabilityScore'], reverse=True)
        
        # Return top 5 recommendations
        return recommendations[:5]


