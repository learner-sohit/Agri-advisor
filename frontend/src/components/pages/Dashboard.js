import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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

  // Fetch states
  const { data: statesData } = useQuery('states', async () => {
    const res = await api.get('/locations/states');
    return res.data.states;
  }, {
    onError: (error) => {
      toast.error('Failed to load states. Please refresh the page.');
    }
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
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load districts');
      }
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
    
    // Validation
    if (!formData.state) {
      toast.error('Please select a state');
      return;
    }
    
    if (!formData.district) {
      toast.error('Please select a district');
      return;
    }
    
    if (!formData.season) {
      toast.error('Please select a season');
      return;
    }

    setLoading(true);
    setRecommendations(null);

    try {
      const res = await api.post('/recommendations/generate', formData);
      // Backend returns { success, data: { recommendations } }
      setRecommendations(res.data.data);
      toast.success('Recommendations generated successfully!');
      
      // Smooth scroll to results
      setTimeout(() => {
        const resultsElement = document.querySelector('.recommendation-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get recommendations. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t('welcome')}</h1>
          <p className="dashboard-subtitle">
            Get AI-powered crop recommendations based on your location and season
          </p>
        </div>
        
        <div className="recommendation-form-container">
          <div className="form-header">
            <div className="form-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2>{t('selectLocation')}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="recommendation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">{t('state')} <span className="required">*</span></label>
                <div className="select-wrapper">
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select State</option>
                    {statesData?.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="district">{t('district')} <span className="required">*</span></label>
                <div className="select-wrapper">
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.state || districtsLoading}
                    className="form-select"
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
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="season">{t('season')} <span className="required">*</span></label>
                <div className="select-wrapper">
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v10m0 0L8 8m4 4 4-4"></path>
                  </svg>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="Kharif">{t('kharif')}</option>
                    <option value="Rabi">{t('rabi')}</option>
                    <option value="Zaid">{t('zaid')}</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-submit ${loading ? 'btn-loading' : ''}`}
              disabled={loading || !formData.state || !formData.district}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Getting Recommendations...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                    <path d="M12 2v10h10"></path>
                  </svg>
                  <span>{t('getRecommendations')}</span>
                </>
              )}
            </button>
          </form>
        </div>

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