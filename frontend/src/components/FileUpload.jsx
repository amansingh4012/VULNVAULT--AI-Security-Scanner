import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import api, { API_URL } from '../utils/api'

export default function FileUpload({ setResults, loading, setLoading }) {
  const { getToken } = useAuth()
  const [file, setFile] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  const getFileIcon = (fileName) => {
    const ext = fileName.toLowerCase().match(/\.[^.]+$/)?.[0]
    const iconMap = {
      '.py': '🐍',
      '.js': '📜',
      '.jsx': '⚛️',
      '.ts': '📘',
      '.tsx': '⚛️',
      '.cpp': '⚙️',
      '.c': '⚙️',
      '.java': '☕',
      '.go': '🔵',
      '.rb': '💎',
      '.php': '🐘',
      '.zip': '📦'
    }
    return iconMap[ext] || '📄'
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const validExtensions = ['.py', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.hpp',
                              '.java', '.go', '.rb', '.php', '.cs', '.swift', '.kt', '.rs', '.zip']
      const fileExt = droppedFile.name.toLowerCase().match(/\.[^.]+$/)?.[0]
      
      if (validExtensions.includes(fileExt)) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError('Unsupported file type. Supported: ' + validExtensions.join(', '))
      }
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validExtensions = ['.py', '.js', '.jsx', '.ts', '.tsx', '.cpp', '.c', '.h', '.hpp',
                              '.java', '.go', '.rb', '.php', '.cs', '.swift', '.kt', '.rs', '.zip']
      const fileExt = selectedFile.name.toLowerCase().match(/\.[^.]+$/)?.[0]
      
      if (validExtensions.includes(fileExt)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Unsupported file type. Supported: ' + validExtensions.join(', '))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file first')
      return
    }
    
    if (!projectName.trim()) {
      setError('Please enter a project name')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('project_name', projectName.trim())

    try {
      // Get Clerk auth token if user is signed in
      const token = await getToken()
      const headers = {
        'Content-Type': 'multipart/form-data',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await api.post(`/scan/upload`, formData, { headers })
      setResults(response.data)
      setProjectName('') // Clear project name after successful scan
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to scan file. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-6">Upload Code File</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Project Name Input */}
        <div className="mb-6">
          <label htmlFor="project-name" className="block text-white font-medium mb-2">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name (e.g., MyApp Security Scan)"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
            required
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-primary-500 bg-primary-500/10 shadow-glow' 
              : 'border-gray-600/50 hover:border-primary-500/50 hover:bg-gray-700/20'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".py,.js,.jsx,.ts,.tsx,.cpp,.c,.h,.hpp,.java,.go,.rb,.php,.cs,.swift,.kt,.rs,.zip"
            onChange={handleChange}
            className="hidden"
          />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-6xl mb-4">{file ? getFileIcon(file.name) : '📄'}</div>
            {file ? (
              <div>
                <p className="text-green-400 font-medium text-lg">{file.name}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-medium mb-2">
                  Drop your code file or ZIP archive here
                </p>
                <p className="text-gray-400 text-sm">
                  Supports: Python, JavaScript, TypeScript, C++, Java, Go, Ruby, PHP, and more
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  (.py, .js, .jsx, .ts, .tsx, .cpp, .java, .go, .rb, .php, .zip)
                </p>
              </div>
            )}
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || !projectName.trim() || loading}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            !file || !projectName.trim() || loading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 shadow-xl hover:shadow-glow-lg transform hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Scanning...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Scan for Vulnerabilities
            </span>
          )}
        </button>
      </form>
    </div>
  )
}
