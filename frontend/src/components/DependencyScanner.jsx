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
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl mr-4">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Dependency Scanner</h2>
              <p className="text-gray-400 mt-1">Scan your project dependencies for known vulnerabilities</p>
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
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Dependency File *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600/50 rounded-xl cursor-pointer bg-gray-700/20 hover:bg-gray-700/30 hover:border-primary-500/50 transition-all duration-300">
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
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 shadow-md">
              <h4 className="text-blue-200 font-semibold mb-2">Supported Files:</h4>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• <strong>package.json</strong> - Scans npm/Node.js dependencies</li>
                <li>• <strong>requirements.txt</strong> - Scans pip/Python dependencies</li>
                <li>• <strong>ZIP file</strong> - Scans entire project (package.json or requirements.txt)</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                <p className="text-red-200"><span className="font-semibold">Error:</span> {error}</p>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={handleScan}
              disabled={loading || !file || !projectName.trim()}
              className="w-full bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white font-bold py-4 px-6 rounded-xl hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-1 shadow-xl hover:shadow-glow-lg"
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
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Scan Dependencies
                </span>
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
  );
}

export default DependencyScanner;
