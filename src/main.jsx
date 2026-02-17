import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import AuthGate from './components/AuthGate.jsx'
import { initBackHandler } from './lib/backHandler.js'

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

// Initialize back-button history buffer BEFORE React mounts.
// Wrapped in try-catch so a failure here never prevents React from rendering.
try { initBackHandler(); } catch (_) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthGate />
    </ErrorBoundary>
  </StrictMode>,
)
