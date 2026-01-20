"""
Model Training Script
Train ML model for crop recommendations using historical data.
This is a placeholder for actual model training implementation.
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def load_training_data(data_path: str = './data/training_data.csv') -> pd.DataFrame:
    """
    Load training data from CSV.
    
    Expected columns:
    state, district, season, soil_ph, soil_oc, soil_n, soil_p, soil_k,
    avg_temp, avg_rainfall, avg_humidity, crop, yield
    """
    if not os.path.exists(data_path):
        print(f"Training data not found: {data_path}")
        print("Please prepare training data first.")
        return None
    
    return pd.read_csv(data_path)

def prepare_features(df: pd.DataFrame) -> tuple:
    """
    Prepare features and target for model training.
    """
    # Feature columns
    feature_cols = [
        'soil_ph', 'soil_oc', 'soil_n', 'soil_p', 'soil_k',
        'avg_temp', 'avg_rainfall', 'avg_humidity'
    ]
    
    # Encode categorical variables
    le_state = LabelEncoder()
    le_district = LabelEncoder()
    le_season = LabelEncoder()
    
    df['state_encoded'] = le_state.fit_transform(df['state'])
    df['district_encoded'] = le_district.fit_transform(df['district'])
    df['season_encoded'] = le_season.fit_transform(df['season'])
    
    feature_cols.extend(['state_encoded', 'district_encoded', 'season_encoded'])
    
    X = df[feature_cols].values
    y_crop = df['crop'].values
    y_yield = df['yield'].values
    
    return X, y_crop, y_yield, {
        'state_encoder': le_state,
        'district_encoder': le_district,
        'season_encoder': le_season
    }

def train_models(X, y_crop, y_yield):
    """
    Train classification model for crop recommendation
    and regression model for yield prediction.
    """
    # Split data
    X_train, X_test, y_crop_train, y_crop_test, y_yield_train, y_yield_test = train_test_split(
        X, y_crop, y_yield, test_size=0.2, random_state=42
    )
    
    # Train crop classifier
    print("Training crop classifier...")
    crop_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    crop_classifier.fit(X_train, y_crop_train)
    
    crop_accuracy = crop_classifier.score(X_test, y_crop_test)
    print(f"Crop classifier accuracy: {crop_accuracy:.2f}")
    
    # Train yield regressor
    print("Training yield regressor...")
    yield_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
    yield_regressor.fit(X_train, y_yield_train)
    
    yield_r2 = yield_regressor.score(X_test, y_yield_test)
    print(f"Yield regressor R² score: {yield_r2:.2f}")
    
    return crop_classifier, yield_regressor

def save_models(crop_model, yield_model, encoders, model_dir: str = './models'):
    """Save trained models and encoders."""
    os.makedirs(model_dir, exist_ok=True)
    
    # Save models
    with open(os.path.join(model_dir, 'crop_classifier.pkl'), 'wb') as f:
        pickle.dump(crop_model, f)
    
    with open(os.path.join(model_dir, 'yield_regressor.pkl'), 'wb') as f:
        pickle.dump(yield_model, f)
    
    # Save encoders
    with open(os.path.join(model_dir, 'encoders.pkl'), 'wb') as f:
        pickle.dump(encoders, f)
    
    print(f"Models saved to {model_dir}")

def main():
    """Main training function."""
    print("Loading training data...")
    df = load_training_data()
    
    if df is None:
        return
    
    print(f"Loaded {len(df)} training samples")
    
    print("Preparing features...")
    X, y_crop, y_yield, encoders = prepare_features(df)
    
    print("Training models...")
    crop_model, yield_model = train_models(X, y_crop, y_yield)
    
    print("Saving models...")
    save_models(crop_model, yield_model, encoders)
    
    print("Training complete!")

if __name__ == "__main__":
    main()


