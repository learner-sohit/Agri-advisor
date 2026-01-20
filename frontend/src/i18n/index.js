import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Agri-Advisor AI',
      selectLocation: 'Select Location',
      state: 'State',
      district: 'District',
      season: 'Season',
      kharif: 'Kharif',
      rabi: 'Rabi',
      zaid: 'Zaid',
      getRecommendations: 'Get Recommendations',
      recommendations: 'Recommendations',
      suitabilityScore: 'Suitability Score',
      yieldPrediction: 'Yield Prediction',
      why: 'Why',
      environmentalSnapshot: 'Environmental Snapshot',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      history: 'History'
    }
  },
  hi: {
    translation: {
      welcome: 'एग्री-एडवाइजर AI में आपका स्वागत है',
      selectLocation: 'स्थान चुनें',
      state: 'राज्य',
      district: 'जिला',
      season: 'मौसम',
      kharif: 'खरीफ',
      rabi: 'रबी',
      zaid: 'जायद',
      getRecommendations: 'सिफारिशें प्राप्त करें',
      recommendations: 'सिफारिशें',
      suitabilityScore: 'उपयुक्तता स्कोर',
      yieldPrediction: 'उपज भविष्यवाणी',
      why: 'क्यों',
      environmentalSnapshot: 'पर्यावरणीय स्नैपशॉट',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      name: 'नाम',
      history: 'इतिहास'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;


