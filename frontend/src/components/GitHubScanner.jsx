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
        headers
      })
      setResults(response.data)
      setProjectName('') // Clear after successful scan
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to scan repository. Check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Scan GitHub Repository</h2>
      
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
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <p className="text-gray-400 text-sm mt-2">
            💡 Enter a public GitHub repository URL
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!repoUrl.trim() || !projectName.trim() || loading}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            !repoUrl.trim() || !projectName.trim() || loading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Cloning & Scanning Repository...
            </span>
          ) : (
            '🔍 Scan Repository'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
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
