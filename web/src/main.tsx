import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './styles.css';
import { App } from './App.tsx';
import { ToastProvider } from './ui.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
