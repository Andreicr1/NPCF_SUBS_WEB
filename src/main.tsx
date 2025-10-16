import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './styles/index.css'
// Legacy client router (kept for vite preview only). Pages moved to app/ (Next.js App Router)
// Remove these imports to avoid Next.js build conflicts.
// import LandingPage from './pages/index'
// import SubscribeIndex from './pages/subscribe/index'
// import SubscribeStepPage from './pages/subscribe/[step]'

const router = createBrowserRouter([
  { path: '*', element: <Navigate to="/" replace /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

