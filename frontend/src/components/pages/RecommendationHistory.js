import React from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import './RecommendationHistory.css';

const RecommendationHistory = () => {
  const { t } = useTranslation();
  
  const { data, isLoading, error } = useQuery('recommendationHistory', async () => {
    const res = await api.get('/recommendations');
    return res.data;
  });

  if (isLoading) {
    return <div className="loading">Loading history...</div>;
  }

  if (error) {
    return <div className="error">Error loading history</div>;
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <h1>Recommendation History</h1>
        {data?.recommendations?.length === 0 ? (
          <div className="no-history">No recommendations found</div>
        ) : (
          <div className="history-list">
            {data?.recommendations?.map((rec) => (
              <div key={rec._id} className="history-item">
                <div className="history-header">
                  <h3>{rec.location.state} - {rec.location.district}</h3>
                  <span className="season-badge">{rec.season}</span>
                  <span className="date">{new Date(rec.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="history-recommendations">
                  {rec.recommendations.slice(0, 3).map((recItem, idx) => (
                    <div key={idx} className="history-rec-item">
                      <span className="rec-rank">#{idx + 1}</span>
                      <span className="rec-crop">{recItem.cropName}</span>
                      <span className="rec-score">{recItem.suitabilityScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationHistory;


