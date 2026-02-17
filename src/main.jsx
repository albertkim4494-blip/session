import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import AuthGate from './components/AuthGate.jsx'
import { initBackHandler } from './lib/backHandler.js'

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

// Initialize back-button history buffer BEFORE React mounts.
// This ensures hash entries exist and the hashchange listener is registered
// before any React lifecycle can interfere.
initBackHandler();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthGate />
    </ErrorBoundary>
  </StrictMode>,
)
