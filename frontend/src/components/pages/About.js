import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const features = [
    {
      icon: '🌾',
      title: 'Smart Crop Recommendations',
      description: 'AI-powered system analyzes soil, climate, and season data to recommend the best crops.',
    },
    {
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: 'Real-time weather forecasts and alerts for timely farming decisions.',
    },
    {
      icon: '🌱',
      title: 'Soil Analysis',
      description: 'Comprehensive soil health assessment with nutrient analysis.',
    },
    {
      icon: '📈',
      title: 'Market Prices',
      description: 'Live prices from major mandis to help you sell at the best time.',
    },
    {
      icon: '📚',
      title: 'Crop Library',
      description: 'Detailed information on 100+ crops with growing tips.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Visual insights into your farming patterns and history.',
    },
  ];

  const howItWorks = [
    { step: 1, title: 'Select Location', description: 'Choose your state and district', icon: '📍' },
    { step: 2, title: 'Enter Data', description: 'Soil type, temperature, rainfall', icon: '🌡️' },
    { step: 3, title: 'Get Results', description: 'AI recommends best crops', icon: '🤖' },
    { step: 4, title: 'View Insights', description: 'Yield & market predictions', icon: '📋' },
    { step: 5, title: 'Decide', description: 'Plan your farming activities', icon: '✅' },
  ];

  const techStack = [
    { name: 'React', icon: '⚛️', description: 'Frontend' },
    { name: 'Node.js', icon: '🟢', description: 'Backend' },
    { name: 'MongoDB', icon: '🍃', description: 'Database' },
    { name: 'FastAPI', icon: '🐍', description: 'ML Service' },
    { name: 'XGBoost', icon: '🚀', description: 'ML Model' },
    { name: 'Docker', icon: '🐳', description: 'Deploy' },
  ];

  const faqs = [
    {
      question: 'How accurate are the crop recommendations?',
      answer: 'Our ML model achieves over 96% accuracy in top-5 crop recommendations, trained on extensive agricultural data from across India.',
    },
    {
      question: 'Is this service free to use?',
      answer: 'Yes! Agri-Advisor is completely free for all farmers. Our mission is to help Indian farmers make better decisions.',
    },
    {
      question: 'How often is market price data updated?',
      answer: 'Market prices are updated daily from major APMC mandis across India from government portals.',
    },
    {
      question: 'Which regions does this cover?',
      answer: 'We cover all major agricultural states of India with data for 700+ districts.',
    },
  ];

  const team = [
    { name: 'AI Team', role: 'Machine Learning', icon: '🤖' },
    { name: 'Backend', role: 'Server & Database', icon: '⚙️' },
    { name: 'Frontend', role: 'User Interface', icon: '🎨' },
    { name: 'Research', role: 'Agricultural Data', icon: '📊' },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>🌾 <span>Agri-Advisor</span></h1>
          <p className="about-hero-subtitle">
            Empowering Indian farmers with AI-driven crop recommendations. 
            Making smart farming accessible through machine learning and real-time data.
          </p>
          <div className="about-hero-buttons">
            <Link to="/register" className="about-btn-primary">Get Started Free</Link>
            <a href="#how-it-works" className="about-btn-secondary">Learn More</a>
          </div>
          <div className="about-stats-row">
            <div className="about-stat">
              <span className="about-stat-value">96.75%</span>
              <span className="about-stat-label">Model Accuracy</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">100+</span>
              <span className="about-stat-label">Crops</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">700+</span>
              <span className="about-stat-label">Districts</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-value">6</span>
              <span className="about-stat-label">Seasons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-section about-features">
        <div className="about-section-header">
          <h2>✨ Features</h2>
          <p>Everything you need for smart farming decisions</p>
        </div>
        <div className="about-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="about-feature-card">
              <span className="about-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="about-section about-how-it-works">
        <div className="about-section-header">
          <h2>🔄 How It Works</h2>
          <p>Get personalized crop recommendations in 5 simple steps</p>
        </div>
        <div className="about-steps">
          {howItWorks.map((step, index) => (
            <div key={index} className="about-step">
              <div className="about-step-number">{step.step}</div>
              <span className="about-step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="about-section about-tech">
        <div className="about-section-header">
          <h2>🛠️ Technology Stack</h2>
          <p>Powered by modern tools and frameworks</p>
        </div>
        <div className="about-tech-grid">
          {techStack.map((tech, index) => (
            <div key={index} className="about-tech-card">
              <span className="about-tech-icon">{tech.icon}</span>
              <h4>{tech.name}</h4>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ML Model Info */}
      <section className="about-section about-ml">
        <div className="about-ml-content">
          <div className="about-ml-text">
            <h2>🤖 Our ML Model</h2>
            <p>
              Our crop recommendation system uses an advanced XGBoost classifier trained on 
              extensive agricultural data from across India.
            </p>
            <ul>
              <li>✅ Soil parameters (N, P, K, pH, organic carbon)</li>
              <li>✅ Climate data (temperature, rainfall, humidity)</li>
              <li>✅ Geographic location (state, district)</li>
              <li>✅ Season-specific crop suitability</li>
            </ul>
            <p>
              The model achieves <strong style={{color: '#4CAF50'}}>96.75% Top-5 accuracy</strong>, 
              meaning the correct crop is within the top 5 recommendations.
            </p>
          </div>
          <div className="about-ml-stats">
            <div className="about-ml-stat">
              <span className="about-ml-stat-value">96.75%</span>
              <span className="about-ml-stat-label">Top-5 Accuracy</span>
            </div>
            <div className="about-ml-stat">
              <span className="about-ml-stat-value">15+</span>
              <span className="about-ml-stat-label">Input Features</span>
            </div>
            <div className="about-ml-stat">
              <span className="about-ml-stat-value">100K+</span>
              <span className="about-ml-stat-label">Training Samples</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="about-section about-faq">
        <div className="about-section-header">
          <h2>❓ FAQ</h2>
          <p>Frequently asked questions</p>
        </div>
        <div className="about-faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`about-faq-item ${activeAccordion === index ? 'active' : ''}`}
            >
              <button 
                className="about-faq-question"
                onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="about-faq-toggle">{activeAccordion === index ? '−' : '+'}</span>
              </button>
              {activeAccordion === index && (
                <div className="about-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section about-team">
        <div className="about-section-header">
          <h2>👥 Our Team</h2>
          <p>Built by passionate developers</p>
        </div>
        <div className="about-team-grid">
          {team.map((member, index) => (
            <div key={index} className="about-team-card">
              <span className="about-team-icon">{member.icon}</span>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Transform Your Farming?</h2>
        <p>Join thousands of farmers making smarter decisions</p>
        <Link to="/register" className="about-cta-btn">Create Free Account</Link>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-content">
          <div className="about-footer-brand">
            <h3>🌾 Agri-Advisor</h3>
            <p>Empowering Indian Farmers</p>
          </div>
          <div className="about-footer-links">
            <h4>Quick Links</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/crop-library">Crop Library</Link>
            <Link to="/weather">Weather</Link>
          </div>
          <div className="about-footer-links">
            <h4>Resources</h4>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/">Home</Link>
          </div>
        </div>
        <div className="about-footer-bottom">
          <p>© 2026 Agri-Advisor. Made with ❤️ for Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
