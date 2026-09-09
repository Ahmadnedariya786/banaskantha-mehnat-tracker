import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './theme.css'

const storedState = localStorage.getItem('theme-storage');
let initialTheme = 'outdoor';
if (storedState) {
  try {
    initialTheme = JSON.parse(storedState).state.theme;
  } catch (e) {}
}
document.documentElement.setAttribute('data-theme', initialTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
