import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Import Clerk publishable key
const PUBLISHABLE_KEY = pk_test_ZmxleGlibGUtYmx1ZWpheS0yOC5jbGVyay5hY2NvdW50cy5kZXYk


if (!PUBLISHABLE_KEY) {
  console.warn('⚠️ Clerk publishable key not found. Authentication will be disabled.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: 'dark',
        variables: { colorPrimary: '#3b82f6' }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
