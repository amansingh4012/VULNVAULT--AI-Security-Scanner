import { useState } from 'react'
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

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📁 Upload File
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'github'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              🐙 GitHub Repo
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'dependencies'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              📦 Dependencies
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              💾 Saved Projects
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

          {/* Results Section */}
          {results && !loading && activeTab !== 'saved' && (
            <div className="mt-8 animate-fadeIn">
              <Results data={results} />
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-400 py-8 mt-16">
        <p>VulnVault - AI-Powered Security Scanner</p>
        <p className="text-sm mt-2">Inspired by Google DeepMind's CodeMender</p>
      </footer>
    </div>
  )
}

function App() {
  return (
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
  )
}

export default App
