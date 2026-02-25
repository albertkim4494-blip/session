import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import AuthGate from './components/AuthGate.jsx'

import { registerSW } from "virtual:pwa-register";
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    // Check for SW updates every 60 seconds so deployed fixes reach users quickly
    if (registration) {
      setInterval(() => { registration.update(); }, 60 * 1000);
    }
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthGate />
    </ErrorBoundary>
  </StrictMode>,
)
