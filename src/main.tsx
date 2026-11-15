import { createRoot } from 'react-dom/client';
import App from './App';
import { LangProvider } from './i18n/LangContext';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <LangProvider>
    <App />
  </LangProvider>,
);
