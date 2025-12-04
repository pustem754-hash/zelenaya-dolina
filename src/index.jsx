import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomeScreen from './components/HomeScreen';

/**
 * Точка входа React-приложения
 * УК "Зелёная долина"
 */

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HomeScreen />
  </React.StrictMode>
);

// Регистрация Service Worker для PWA (опционально)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('✅ SW registered:', registration);
      })
      .catch(error => {
        console.log('❌ SW registration failed:', error);
      });
  });
}
