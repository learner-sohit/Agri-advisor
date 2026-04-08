import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './MarketPrices.css';

const MarketPrices = () => {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [selectedState, setSelectedState] = useState('');
  const [timeRange, setTimeRange] = useState('1month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [confidence, setConfidence] = useState('');
  const [statesLoading, setStatesLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);

  // Crop data with icons
  const crops = [
    { id: 'rice', name: 'Rice', icon: '🌾', unit: 'quintal' },
    { id: 'wheat', name: 'Wheat', icon: '🌾', unit: 'quintal' },
    { id: 'cotton', name: 'Cotton', icon: '🏵️', unit: 'quintal' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', unit: 'quintal' },
    { id: 'soybean', name: 'Soybean', icon: '🫘', unit: 'quintal' },
    { id: 'groundnut', name: 'Groundnut', icon: '🥜', unit: 'quintal' },
    { id: 'potato', name: 'Potato', icon: '🥔', unit: 'quintal' },
    { id: 'onion', name: 'Onion', icon: '🧅', unit: 'quintal' },
    { id: 'tomato', name: 'Tomato', icon: '🍅', unit: 'quintal' },
    { id: 'maize', name: 'Maize', icon: '🌽', unit: 'quintal' },
  ];

  const stateOptions = useMemo(
    () => availableStates.slice().sort((a, b) => a.localeCompare(b)),
    [availableStates]
  );

  const [priceData, setPriceData] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  const findExactMatch = (options, value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) {
      return '';
    }
    return options.find((option) => option.toLowerCase() === normalized) || '';
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAvailableStates = async () => {
      setStatesLoading(true);
      setError('');

      try {
        const response = await api.get('/market-prices/available-locations', {
          params: { crop: selectedCrop }
        });

        if (!isMounted) {
          return;
        }

        const payload = response.data?.data || {};
        const states = Array.isArray(payload.states) ? payload.states : [];

        setAvailableStates(states);

        setSelectedState((prevState) => {
          if (prevState && states.includes(prevState)) {
            return prevState;
          }

          const userState = findExactMatch(states, user?.state);
          return userState || states[0] || '';
        });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setAvailableStates([]);
        setSelectedState('');
        setError(err.response?.data?.message || 'Unable to load available mandi locations for this crop.');
      } finally {
        if (isMounted) {
          setStatesLoading(false);
        }
      }
    };

    fetchAvailableStates();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop, user]);

  useEffect(() => {
    if (statesLoading) {
      return;
    }

    if (!selectedState) {
      setPriceData([]);
      setMandiPrices([]);
      setCurrentPrice(null);
      if (!availableStates.length && !statesLoading) {
        setError('No mandi states available for this crop right now.');
      } else {
        setError('Please select a state to load mandi prices.');
      }
      setLastUpdated('');
      setConfidence('');
      return;
    }

    let isMounted = true;

    const fetchMarketPrices = async () => {
      setLoading(true);
      setError('');

      try {
        const cropName = crops.find((crop) => crop.id === selectedCrop)?.name || selectedCrop;
        const response = await api.get('/market-prices', {
          params: {
            crop: cropName,
            state: selectedState,
            timeRange
          }
        });

        if (!isMounted) {
          return;
        }

        const payload = response.data?.data || {};
        const trend = Array.isArray(payload.trend) ? payload.trend : [];
        const mappedTrend = trend.map((point) => {
          const dateObj = new Date(point.date);
          const safeDate = Number.isNaN(dateObj.getTime())
            ? point.date
            : dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          return {
            date: safeDate,
            price: Number(point.price) || 0,
            minPrice: Number(point.minPrice) || Number(point.price) || 0,
            maxPrice: Number(point.maxPrice) || Number(point.price) || 0
          };
        });

        const mandis = Array.isArray(payload.mandis) ? payload.mandis : [];
        const mappedMandis = mandis.map((item) => ({
          name: item.mandi,
          location: `${item.district}, ${item.state}`,
          price: Number(item.price) || 0,
          change: Number(item.changePct) || 0,
          arrivals: Number(item.arrivalsQuintal) || 0,
          source: item.source || 'N/A',
          sourceDate: item.sourceDate || ''
        }));

        setPriceData(mappedTrend);
        setMandiPrices(mappedMandis);
        setCurrentPrice(
          mappedTrend[mappedTrend.length - 1] ||
          (payload.averagePrice
            ? { price: Number(payload.averagePrice), minPrice: Number(payload.averagePrice), maxPrice: Number(payload.averagePrice) }
            : null)
        );
        setLastUpdated(payload.lastUpdated || '');
        setConfidence(payload.confidence || '');
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setPriceData([]);
        setMandiPrices([]);
        setCurrentPrice(null);
        setLastUpdated('');
        setConfidence('');
        setError(err.response?.data?.message || 'Failed to fetch current mandi prices.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMarketPrices();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop, selectedState, timeRange, statesLoading, availableStates.length]);

  const selectedCropData = crops.find(c => c.id === selectedCrop);
  
  const priceChange = priceData.length > 1 
    ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price * 100).toFixed(2)
    : 0;

  const rangeMin = priceData.length ? Math.min(...priceData.map(d => d.minPrice)) : currentPrice?.minPrice || 0;
  const rangeMax = priceData.length ? Math.max(...priceData.map(d => d.maxPrice)) : currentPrice?.maxPrice || 0;

  const mspPrices = {
    rice: 2203, wheat: 2275, cotton: 6620, sugarcane: 315,
    soybean: 4600, groundnut: 6377, maize: 2090,
  };

  return (
    <div className="market-prices-container">
      <div className="market-header">
        <h1>📈 Market Prices</h1>
        <p>Live mandi prices for your selected state and crop</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Select Crop</label>
          <div className="crop-selector">
            {crops.map(crop => (
              <button
                key={crop.id}
                className={`crop-btn ${selectedCrop === crop.id ? 'active' : ''}`}
                onClick={() => setSelectedCrop(crop.id)}
              >
                <span className="crop-icon">{crop.icon}</span>
                <span className="crop-name">{crop.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-item">
            <label>State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={statesLoading || !stateOptions.length}
            >
              <option value="">{statesLoading ? 'Loading states...' : 'Select state'}</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Time Range</label>
            <div className="time-buttons">
              {[
                { id: '1week', label: '1W' },
                { id: '1month', label: '1M' },
                { id: '3month', label: '3M' },
                { id: '6month', label: '6M' },
              ].map(t => (
                <button
                  key={t.id}
                  className={timeRange === t.id ? 'active' : ''}
                  onClick={() => setTimeRange(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading market data...</p>
        </div>
      ) : (
        <>
          {error && <div className="market-error">{error}</div>}

          {/* Price Overview Cards */}
          <div className="price-overview">
            <div className="price-card current">
              <span className="card-label">Current Price</span>
              <span className="card-value">
                {selectedCropData?.icon} ₹{currentPrice?.price?.toLocaleString() || 'N/A'}
              </span>
              <span className="card-unit">per {selectedCropData?.unit}</span>
            </div>

            <div className={`price-card change ${parseFloat(priceChange) >= 0 ? 'positive' : 'negative'}`}>
              <span className="card-label">Price Change</span>
              <span className="card-value">
                {parseFloat(priceChange) >= 0 ? '📈' : '📉'} {priceChange}%
              </span>
              <span className="card-unit">in selected period</span>
            </div>

            <div className="price-card range">
              <span className="card-label">Price Range</span>
              <span className="card-value">
                ₹{rangeMin.toLocaleString()} - ₹{rangeMax.toLocaleString()}
              </span>
              <span className="card-unit">min - max</span>
            </div>

            {mspPrices[selectedCrop] && (
              <div className="price-card msp">
                <span className="card-label">MSP (2024-25)</span>
                <span className="card-value">₹{mspPrices[selectedCrop].toLocaleString()}</span>
                <span className="card-unit">Minimum Support Price</span>
              </div>
            )}
          </div>

          {/* Price Chart */}
          <div className="chart-section">
            <h3>💹 Price Trend - {selectedCropData?.name}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, '']}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  name="Market Price"
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="minPrice" 
                  name="Min Price" 
                  stroke="#2196F3" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="maxPrice" 
                  name="Max Price" 
                  stroke="#f44336" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mandi Prices Table */}
          <div className="mandi-section">
            <h3>🏪 Mandi-wise Prices</h3>
            {(lastUpdated || confidence) && (
              <p className="market-meta">
                {lastUpdated ? `Last update: ${new Date(lastUpdated).toLocaleString('en-IN')}` : ''}
                {lastUpdated && confidence ? ' | ' : ''}
                {confidence ? `Confidence: ${confidence}` : ''}
              </p>
            )}
            <div className="mandi-table-wrapper">
              <table className="mandi-table">
                <thead>
                  <tr>
                    <th>Mandi</th>
                    <th>Location</th>
                    <th>Price (₹/{selectedCropData?.unit})</th>
                    <th>Change</th>
                    <th>Arrivals (Quintals)</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiPrices.map((mandi, index) => (
                    <tr key={index}>
                      <td className="mandi-name">{mandi.name}</td>
                      <td>{mandi.location}</td>
                      <td className="price-cell">₹{mandi.price.toLocaleString()}</td>
                      <td className={`change-cell ${mandi.change >= 0 ? 'positive' : 'negative'}`}>
                        {mandi.change >= 0 ? '+' : ''}{mandi.change.toFixed(2)}%
                      </td>
                      <td>{mandi.arrivals.toLocaleString()}</td>
                      <td>{mandi.sourceDate ? `${mandi.source} (${new Date(mandi.sourceDate).toLocaleDateString('en-IN')})` : mandi.source}</td>
                    </tr>
                  ))}
                  {!mandiPrices.length && (
                    <tr>
                      <td colSpan="6">No mandi records available for this selection.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Market Insights */}
          <div className="insights-section">
            <h3>💡 Market Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <span className="insight-icon">📅</span>
                <h4>Current Trend</h4>
                <p>
                  {parseFloat(priceChange) < 0
                    ? `${selectedCropData?.name} prices are trending downward in ${selectedState || 'your state'}.`
                    : `${selectedCropData?.name} prices are trending upward in ${selectedState || 'your state'}.`}
                </p>
              </div>
              <div className="insight-card">
                <span className="insight-icon">📦</span>
                <h4>Storage Advice</h4>
                <p>{parseFloat(priceChange) < 0 
                  ? 'Prices are declining. Consider selling soon or storing properly for later.' 
                  : 'Prices are rising. Consider holding stock if storage conditions permit.'}</p>
              </div>
              <div className="insight-card">
                <span className="insight-icon">🚛</span>
                <h4>State Mandi Focus</h4>
                <p>Mandis from {selectedState || 'the selected state'} are shown so you can compare active markets with real reported prices.</p>
              </div>
              <div className="insight-card">
                <span className="insight-icon">📱</span>
                <h4>Price Alert</h4>
                <p>Set price alerts to get notified when {selectedCropData?.name} reaches your target price.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketPrices;
