import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function SavedProjects({ onLoadResults }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)

  // Fetch saved projects
  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/api/projects`)
      setProjects(response.data.projects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.response?.data?.detail || 'Failed to load saved projects. Please ensure MongoDB is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Load project results
  const handleLoadProject = async (projectName) => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/${encodeURIComponent(projectName)}`)
      if (onLoadResults) {
        onLoadResults(response.data)
      }
    } catch (err) {
      console.error('Error loading project:', err)
      alert('Failed to load project: ' + (err.response?.data?.detail || err.message))
    }
  }

  // Delete project
  const handleDeleteProject = async (projectName) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProject(projectName)
    try {
      await axios.delete(`${API_URL}/api/projects/${encodeURIComponent(projectName)}`)
      // Remove from local state
      setProjects(projects.filter(p => p.project_name !== projectName))
      alert(`Project "${projectName}" deleted successfully`)
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project: ' + (err.response?.data?.detail || err.message))
    } finally {
      setDeletingProject(null)
    }
  }

  // Download PDF report
  const handleDownloadPDF = async (projectName) => {
    try {
      const response = await axios.get(
        `${API_URL}/projects/${encodeURIComponent(projectName)}/pdf`,
        { responseType: 'blob' }
      )
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${projectName.replace(/\s/g, '_')}_report.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading PDF:', err)
      alert('Failed to generate PDF: ' + (err.response?.data?.detail || err.message))
    }
  }

  // Get severity badge color
  const getSeverityColor = (severity) => {
    const colors = {
      HIGH: 'bg-red-500',
      MEDIUM: 'bg-yellow-500',
      LOW: 'bg-blue-500'
    }
    return colors[severity] || 'bg-gray-500'
  }

  // Get security score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  // Get scan type icon
  const getScanTypeIcon = (scanType) => {
    const icons = {
      file_upload: '📁',
      github: '🐙',
      dependencies: '📦'
    }
    return icons[scanType] || '📄'
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center shadow-lg">
        <div className="text-red-400 text-xl mb-2">⚠️ Error</div>
        <div className="text-gray-300">{error}</div>
        <button
          onClick={fetchProjects}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-glow transform hover:-translate-y-0.5"
        >
          Retry
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl mx-auto mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Saved Projects</h3>
        <p className="text-gray-400">
          Scan some code to save your first project!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">Saved Projects</h2>
          <p className="text-gray-400">
            {projects.length} saved scan{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchProjects}
          className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-glow transform hover:-translate-y-0.5"
        >
          <span>Refresh</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.project_name}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-glow transform hover:-translate-y-1"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">
                    {getScanTypeIcon(project.scan_type)}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate">
                    {project.project_name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  {formatDate(project.created_at)}
                </p>
              </div>
            </div>

            {/* Security Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Security Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(project.security_score)}`}>
                  {project.security_score}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    project.security_score >= 80 ? 'bg-green-500' :
                    project.security_score >= 60 ? 'bg-yellow-500' :
                    project.security_score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${project.security_score}%` }}
                />
              </div>
            </div>

            {/* Vulnerability Summary */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">
                {project.total_issues} issue{project.total_issues !== 1 ? 's' : ''} found
              </div>
              <div className="flex gap-2">
                {project.summary.high > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                    {project.summary.high} HIGH
                  </span>
                )}
                {project.summary.medium > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                    {project.summary.medium} MED
                  </span>
                )}
                {project.summary.low > 0 && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                    {project.summary.low} LOW
                  </span>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-4 text-sm text-gray-400">
              {project.file_name && (
                <div className="truncate">📄 {project.file_name}</div>
              )}
              {project.repo_url && (
                <div className="truncate">🔗 {project.repo_url.split('/').slice(-2).join('/')}</div>
              )}
              {project.files_scanned && (
                <div>📊 {project.files_scanned} files scanned</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLoadProject(project.project_name)}
                className="flex-1 px-3 py-2 bg-transparent border-2 border-gray-600/50 hover:border-primary-500 text-gray-300 hover:text-primary-400 rounded-lg transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
              <button
                onClick={() => handleDownloadPDF(project.project_name)}
                className="px-3 py-2 bg-transparent border-2 border-gray-600/50 hover:border-green-500 text-gray-300 hover:text-green-400 rounded-lg transition-all duration-200 text-sm font-semibold flex items-center gap-1"
                title="Download PDF"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => handleDeleteProject(project.project_name)}
                disabled={deletingProject === project.project_name}
                className="px-3 py-2 bg-transparent border-2 border-gray-600/50 hover:border-red-500 text-gray-300 hover:text-red-400 rounded-lg transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deletingProject === project.project_name ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
