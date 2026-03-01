import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import both pages
import LandingPage from './LandingPage.jsx'
import App from './App.jsx' // Your untouched tool!

import './index.css' // Your global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The Front Door */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Your Main Dashboard */}
        <Route path="/tool" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)