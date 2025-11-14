import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export default function Results({ data }) {
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [loadingAI, setLoadingAI] = useState(null) // Track which vulnerability is loading
  const [aiError, setAiError] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0) // Track loading progress

  const handleGetAIFix = async (vulnerability, index) => {
    setLoadingAI(index) // Set the specific index being processed
    setAiError(null)
    setLoadingProgress(0)
    
    // Simulate progress while waiting for AI response
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return 90 // Cap at 90% until real response
        return prev + 10
      })
    }, 500) // Update every 500ms
    
    try {
      const response = await axios.post(`${API_URL}/ai/fix-suggestion`, vulnerability, {
        timeout: 60000 // 60 second timeout for AI response
      })
      
      clearInterval(progressInterval)
      setLoadingProgress(100) // Complete
      
      setTimeout(() => {
        setAiSuggestion({
          vulnerability: vulnerability,
          suggestion: response.data.fix_suggestion
        })
      }, 300) // Small delay to show 100%
      
    } catch (err) {
      clearInterval(progressInterval)
      if (err.code === 'ECONNABORTED') {
        setAiError('Request timed out. Gemini AI is taking too long to respond. Please try again.')
      } else {
        setAiError(err.response?.data?.detail || 'Failed to get AI suggestion. Make sure Gemini API key is configured.')
      }
      console.error('AI Error:', err)
    } finally {
      setTimeout(() => {
        setLoadingAI(null) // Clear loading state
        setLoadingProgress(0)
      }, 300)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      HIGH: 'bg-red-500/20 border-red-500 text-red-400',
      MEDIUM: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
      LOW: 'bg-blue-500/20 border-blue-500 text-blue-400',
    }
    return colors[severity] || 'bg-gray-500/20 border-gray-500 text-gray-400'
  }

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      HIGH: 'bg-red-500 text-white',
      MEDIUM: 'bg-yellow-500 text-black',
      LOW: 'bg-blue-500 text-white',
    }
    return colors[severity] || 'bg-gray-500 text-white'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  return (
    <div className="space-y-6">
      {/* Security Score Dashboard */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Security Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Score */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(data.security_score)}`}>
              {data.security_score}
            </div>
            <div className="text-gray-400 mt-2">Security Score</div>
            <div className={`text-2xl font-bold mt-1 ${getScoreColor(data.security_score)}`}>
              Grade {getScoreGrade(data.security_score)}
            </div>
          </div>

          {/* High Issues */}
          <div className="text-center">
            <div className="text-5xl font-bold text-red-400">
              {data.summary.high || 0}
            </div>
            <div className="text-gray-400 mt-2">High Severity</div>
          </div>

          {/* Medium Issues */}
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-400">
              {data.summary.medium || 0}
            </div>
            <div className="text-gray-400 mt-2">Medium Severity</div>
          </div>

          {/* Low Issues */}
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-400">
              {data.summary.low || 0}
            </div>
            <div className="text-gray-400 mt-2">Low Severity</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between text-gray-300">
            <span>📊 Total Issues Found:</span>
            <span className="font-bold text-xl">{data.total_issues}</span>
          </div>
          {data.file_name && (
            <div className="flex items-center justify-between text-gray-300 mt-2">
              <span>📄 File Scanned:</span>
              <span className="font-mono text-sm">{data.file_name}</span>
            </div>
          )}
          {data.files_scanned && (
            <div className="flex items-center justify-between text-gray-300 mt-2">
              <span>📁 Files Scanned:</span>
              <span className="font-bold">{data.files_scanned}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vulnerabilities List */}
      {data.vulnerabilities && data.vulnerabilities.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">
            🔍 Vulnerabilities Detected
          </h3>
          
          <div className="space-y-4">
            {data.vulnerabilities.map((vuln, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-6 ${getSeverityColor(vuln.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                    <span className="text-white font-bold">{vuln.type}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {vuln.line_number && <>Line {vuln.line_number}</>}
                    {vuln.file && <> • {vuln.file}</>}
                    {vuln.package && <> • Package: {vuln.package}</>}
                    {vuln.current_version && <> v{vuln.current_version}</>}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{vuln.description}</p>

                {/* Show masked value for secrets */}
                {vuln.masked_value && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">🔐 Detected:</span>
                      <code className="text-red-300 font-mono text-sm">{vuln.masked_value}</code>
                    </div>
                  </div>
                )}

                {vuln.code && !vuln.masked_value && (
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                    <code className="text-red-400 text-sm font-mono whitespace-pre">
                      {vuln.code}
                    </code>
                  </div>
                )}

                {vuln.suggestion && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">💡 Fix:</span>
                      <p className="text-green-300 text-sm">{vuln.suggestion}</p>
                    </div>
                  </div>
                )}

                {/* AI Fix Button */}
                <div>
                  <button
                    onClick={() => handleGetAIFix(vuln, index)}
                    disabled={loadingAI === index}
                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAI === index ? '🤖 Generating AI Fix...' : '🤖 Get AI Fix Suggestion'}
                  </button>
                  
                  {/* Progress Bar */}
                  {loadingAI === index && (
                    <div className="mt-3 space-y-2">
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-full transition-all duration-500 ease-out flex items-center justify-center"
                          style={{ width: `${loadingProgress}%` }}
                        >
                          <div className="text-xs font-bold text-white drop-shadow-lg">
                            {loadingProgress > 15 && `${loadingProgress}%`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400 text-xs">
                        <div className="animate-spin">⚙️</div>
                        <span>
                          {loadingProgress < 30 && 'Connecting to Gemini AI...'}
                          {loadingProgress >= 30 && loadingProgress < 60 && 'Analyzing vulnerability...'}
                          {loadingProgress >= 60 && loadingProgress < 90 && 'Generating fix suggestions...'}
                          {loadingProgress >= 90 && 'Finalizing response...'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestion Modal */}
      {aiSuggestion && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setAiSuggestion(null)}>
          <div className="bg-gray-800 rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto p-8 border border-purple-500" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-purple-400">🤖 AI-Powered Fix Suggestion</h3>
              <button
                onClick={() => setAiSuggestion(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadgeColor(aiSuggestion.vulnerability.severity)}`}>
                  {aiSuggestion.vulnerability.severity}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-700 text-white">
                  {aiSuggestion.vulnerability.type}
                </span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap">
                {aiSuggestion.suggestion}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setAiSuggestion(null)}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Error */}
      {aiError && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-red-400">{aiError}</p>
          <button
            onClick={() => setAiError(null)}
            className="mt-2 text-red-300 underline text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* No Issues Found */}
      {data.vulnerabilities && data.vulnerabilities.length === 0 && (
        <div className="bg-green-500/10 border border-green-500 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-400 mb-2">
            No Vulnerabilities Found!
          </h3>
          <p className="text-gray-300">
            Your code looks secure. Great job! 🎉
          </p>
        </div>
      )}

      {/* Download Report Button */}
      <div className="text-center">
        <button
          onClick={() => {
            const dataStr = JSON.stringify(data, null, 2)
            const blob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `vulnvault-report-${Date.now()}.json`
            link.click()
          }}
          className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
        >
          📥 Download Report (JSON)
        </button>
      </div>
    </div>
  )
}
