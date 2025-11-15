import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api, { API_URL } from '../utils/api'

export default function GitHubScanner({ setResults, loading, setLoading }) {
  const { getToken } = useAuth()
  const [repoUrl, setRepoUrl] = useState('')
  const [projectName, setProjectName] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL')
      return
    }

    if (!repoUrl.includes('github.com')) {
      setError('Please enter a valid GitHub URL')
      return
    }
    
    if (!projectName.trim()) {
      setError('Please enter a project name')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // Get Clerk auth token if user is signed in
      const token = await getToken()
      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await api.post(`/scan/github`, null, {
        params: { 
          repo_url: repoUrl,
          project_name: projectName.trim()
        },
        headers,
        timeout: 600000 // 10 minutes timeout for large repos
      })
      setResults(response.data)
      setProjectName('') // Clear after successful scan
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The repository might be too large or the server is busy. Please try again or check your Saved Projects.')
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and ensure the backend server is running.')
      } else {
        setError(err.response?.data?.detail || 'Failed to scan repository. Check the URL and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-6">Scan GitHub Repository</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Project Name Input */}
        <div className="mb-6">
          <label htmlFor="github-project-name" className="block text-white font-medium mb-2">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="github-project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name (e.g., Django Security Audit)"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">
            Repository URL
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 hover:bg-gray-700/70"
          />
          <p className="text-gray-400 text-sm mt-2">
            Enter a public GitHub repository URL
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!repoUrl.trim() || !projectName.trim() || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            !repoUrl.trim() || !projectName.trim() || loading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 shadow-xl hover:shadow-glow-lg transform hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cloning & Scanning Repository...
              </span>
              <span className="text-sm text-gray-400">This may take several minutes for large repositories</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Scan Repository
            </span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg shadow-md">
        <p className="text-blue-400 text-sm">
          <strong>Example repositories to try:</strong>
        </p>
        <ul className="text-gray-300 text-sm mt-2 space-y-1">
          <li>• https://github.com/django/django</li>
          <li>• https://github.com/pallets/flask</li>
          <li>• Any public Python repository</li>
        </ul>
      </div>
    </div>
  )
}
