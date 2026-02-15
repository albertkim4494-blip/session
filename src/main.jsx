import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import AuthGate from './components/AuthGate.jsx'

import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

// Dev tool: ?pose-editor opens the animation editor
const isPoseEditor = new URLSearchParams(window.location.search).has("pose-editor");
const PoseEditor = isPoseEditor ? lazy(() => import("./tools/PoseEditor")) : null;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPoseEditor ? (
      <Suspense fallback={<div style={{ padding: 40, color: "#fff", background: "#1a1a2e" }}>Loading Pose Editor...</div>}>
        <PoseEditor />
      </Suspense>
    ) : (
      <ErrorBoundary>
        <AuthGate />
      </ErrorBoundary>
    )}
  </StrictMode>,
)
