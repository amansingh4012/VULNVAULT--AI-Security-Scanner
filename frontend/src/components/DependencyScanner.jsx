import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../utils/api';
import Results from './Results';

function DependencyScanner() {
  const { getToken } = useAuth();
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileName = selectedFile?.name.toLowerCase();
    
    const isValid = fileName && (
      fileName.endsWith('.zip') || 
      fileName === 'package.json' || 
      fileName.endsWith('package.json') ||
      fileName === 'requirements.txt' || 
      fileName.endsWith('requirements.txt')
    );
    
    if (selectedFile && !isValid) {
      setError('Please select package.json, requirements.txt, or a ZIP file');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleScan = async () => {
    if (!file || !projectName.trim()) {
      setError('Please select a ZIP file and enter a project name');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_name', projectName.trim());

    try {
      // Get Clerk auth token if user is signed in
      const token = await getToken();
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await api.post('/scan/dependencies', formData, {
        headers,
        timeout: 180000, // 3 minutes for dependency scanning
      });

      setResults(response.data);
    } catch (err) {
      console.error('Dependency scan error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Scan timeout. The dependency scan is taking too long. Try with a smaller project.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Invalid request. Please check your inputs.');
      } else {
        setError(err.response?.data?.detail || 'Failed to scan dependencies. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl shadow-2xl p-8 border border-purple-700/40">
          <div className="flex items-center mb-6">
            <span className="text-5xl mr-4">📦</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Dependency Scanner</h2>
              <p className="text-gray-300 mt-1">Scan your project dependencies for known vulnerabilities</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Project Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter unique project name"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Dependency File *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">package.json, requirements.txt, or ZIP file</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".zip,.json,.txt,application/json,text/plain"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-green-300">✓ Selected: {file.name}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-semibold mb-2">📋 Supported Files:</h4>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• <strong>package.json</strong> - Scans npm/Node.js dependencies</li>
                <li>• <strong>requirements.txt</strong> - Scans pip/Python dependencies</li>
                <li>• <strong>ZIP file</strong> - Scans entire project (package.json or requirements.txt)</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                <p className="text-red-200">⚠️ {error}</p>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScan}
              disabled={loading || !file || !projectName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning Dependencies...
                </span>
              ) : (
                '🔍 Scan Dependencies'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-8">
            <Results data={results} projectName={projectName} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DependencyScanner;
