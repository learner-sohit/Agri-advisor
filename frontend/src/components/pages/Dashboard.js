import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import RecommendationResults from '../recommendations/RecommendationResults';
import EnvironmentalSnapshot from '../recommendations/EnvironmentalSnapshot';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    season: 'Kharif'
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch states
  const { data: statesData } = useQuery('states', async () => {
    const res = await api.get('/locations/states');
    return res.data.states;
  });

  // Fetch districts when state is selected
  const { data: districtsData, isLoading: districtsLoading, error: districtsError } = useQuery(
    ['districts', formData.state],
    async () => {
      if (!formData.state) return [];
      const res = await api.get(`/locations/districts/${encodeURIComponent(formData.state)}`);
      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to fetch districts');
      }
      return res.data.districts || [];
    },
    { 
      enabled: !!formData.state,
      retry: 1,
      staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ...(e.target.name === 'state' && { district: '' }) // Reset district when state changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const res = await api.post('/recommendations/generate', formData);
      // Backend returns { success, data: { recommendations } }
      setRecommendations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1 className="dashboard-title">{t('welcome')}</h1>
        
        <div className="recommendation-form-container">
          <form onSubmit={handleSubmit} className="recommendation-form">
            <h2>{t('selectLocation')}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('state')}</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  {statesData?.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('district')}</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  disabled={!formData.state || districtsLoading}
                >
                  <option value="">
                    {districtsLoading 
                      ? 'Loading districts...' 
                      : districtsError 
                      ? 'Error loading districts' 
                      : 'Select District'}
                  </option>
                  {districtsData && districtsData.length > 0 ? (
                    districtsData.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))
                  ) : districtsData && districtsData.length === 0 && !districtsLoading ? (
                    <option value="" disabled>
                      No districts available
                    </option>
                  ) : null}
                </select>
                {districtsError && (
                  <small style={{ color: 'red', display: 'block', marginTop: '5px' }}>
                    {districtsError.response?.data?.message || districtsError.message || 'Failed to load districts'}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>{t('season')}</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                >
                  <option value="Kharif">{t('kharif')}</option>
                  <option value="Rabi">{t('rabi')}</option>
                  <option value="Zaid">{t('zaid')}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !formData.state || !formData.district}
            >
              {loading ? 'Getting Recommendations...' : t('getRecommendations')}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {recommendations && (
          <>
            <RecommendationResults recommendations={recommendations.recommendations} />
            <EnvironmentalSnapshot snapshot={recommendations.environmentalSnapshot} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


