import { useState, useEffect, Component } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import FileUpload from './components/FileUpload'
import GitHubScanner from './components/GitHubScanner'
import DependencyScanner from './components/DependencyScanner'
import SavedProjects from './components/SavedProjects'
import Results from './components/Results'
import Header from './components/Header'

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-4">Please refresh the page or contact support.</p>
            <pre className="bg-gray-900 p-4 rounded text-sm text-red-300 overflow-auto">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Suppress browser extension errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message.includes('message channel closed') || 
        e.message.includes('Extension context invalidated')) {
      e.preventDefault()
      e.stopPropagation()
    }
  })
  
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.message?.includes('message channel closed') ||
        e.reason?.message?.includes('Extension context invalidated')) {
      e.preventDefault()
      e.stopPropagation()
    }
  })
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  
  console.log('ProtectedRoute - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading authentication...</div>
        </div>
      </div>
    )
  }
  
  if (!isSignedIn) {
    console.log('User not signed in, redirecting to home');
    return <Navigate to="/" replace />
  }
  
  console.log('User authenticated, rendering children');
  return children
}

// Main Scanner Component
function Scanner() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  // Handle loading saved project results
  const handleLoadSavedResults = (projectData) => {
    setResults(projectData)
    setActiveTab('upload') // Switch to results view
  }

  console.log('Scanner component rendered, activeTab:', activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-1.5 flex gap-1 border border-gray-700/50 shadow-xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/50 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'github'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/50 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              GitHub Repo
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'dependencies'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/50 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Dependencies
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/50 transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Saved Projects
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'upload' ? (
            <FileUpload 
              setResults={setResults} 
              loading={loading}
              setLoading={setLoading}
            />
          ) : activeTab === 'github' ? (
            <GitHubScanner 
              setResults={setResults}
              loading={loading}
              setLoading={setLoading}
            />
          ) : activeTab === 'dependencies' ? (
            <DependencyScanner />
          ) : activeTab === 'saved' ? (
            <SavedProjects onLoadResults={handleLoadSavedResults} />
          ) : null}

          {/* Results Modal */}
          {results && !loading && activeTab !== 'saved' && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="relative w-full max-w-7xl my-8">
                <button
                  onClick={() => setResults(null)}
                  className="absolute -top-12 right-0 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close Results
                </button>
                <div className="animate-fadeIn">
                  <Results data={results} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-400 py-8 mt-16 border-t border-gray-800/50">
        <p className="font-semibold text-gray-300">VulnVault - AI-Powered Security Scanner</p>
        <p className="text-sm mt-2 text-gray-500">Inspired by Google DeepMind's CodeMender</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/scan" 
            element={
              <ProtectedRoute>
                <Scanner />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
