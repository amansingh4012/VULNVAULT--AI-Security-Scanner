import { useAuth, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to load before redirecting
    if (isLoaded && isSignedIn) {
      console.log('✅ User signed in, redirecting to /scan');
      navigate('/scan', { replace: true });
    }
  }, [isSignedIn, isLoaded, navigate]);

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent drop-shadow-2xl">
            VulnVault
          </h1>
          <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent mb-8">
            AI-Powered Security Vulnerability Scanner
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Detect security vulnerabilities in your code and dependencies with advanced AI analysis. 
            Keep your applications secure with real-time scanning and actionable insights.
          </p>
          
          {!isSignedIn && (
            <div className="flex justify-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white font-bold py-5 px-10 rounded-xl hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-glow-lg text-lg animate-gradient">
                  Sign In to Get Started
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-primary-500/50 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mb-4">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Code Scanning</h3>
            <p className="text-gray-400 leading-relaxed">
              Upload source code files in Python, JavaScript, C++, Java, and more. 
              Detects SQL injection, XSS, hardcoded secrets, and 50+ vulnerability types.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-secondary-500/50 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl mb-4">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Dependency Scanning</h3>
            <p className="text-gray-400 leading-relaxed">
              Scan package.json and requirements.txt for known vulnerabilities. 
              Supports npm and pip with real-time CVE database lookup.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 hover:border-accent-500/50 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl mb-4">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">GitHub Scanning</h3>
            <p className="text-gray-400 leading-relaxed">
              Scan entire GitHub repositories by URL. 
              Analyzes multiple files, dependencies, and secrets across your project.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl p-12 border border-gray-700/50 mb-16 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/50">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Sign In</h4>
              <p className="text-gray-400 text-sm">
                Create a free account with Clerk authentication
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-secondary-500/50">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Upload Code</h4>
              <p className="text-gray-400 text-sm">
                Upload files, dependency lists, or provide GitHub URL
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-accent-600 to-accent-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-accent-500/50">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-400 text-sm">
                Advanced scanners detect vulnerabilities & generate security score
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/50">
                4
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Get Results</h4>
              <p className="text-gray-400 text-sm">
                View detailed reports with AI-powered fix suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-br from-primary-900/30 via-secondary-900/30 to-accent-900/30 backdrop-blur-lg rounded-2xl p-12 border border-primary-500/30 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Fix Suggestions</h4>
                <p className="text-gray-300">
                  Get intelligent fix recommendations powered by Google Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Secret Detection</h4>
                <p className="text-gray-300">
                  Finds hardcoded API keys, passwords, and tokens in your code
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Email Alerts</h4>
                <p className="text-gray-300">
                  Instant notifications for critical vulnerabilities to your email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Saved Projects</h4>
                <p className="text-gray-300">
                  Store scan history and track security improvements over time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Security Score</h4>
                <p className="text-gray-300">
                  Get a 0-100 security score based on vulnerability severity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">PDF Reports</h4>
                <p className="text-gray-300">
                  Export detailed security reports as professional PDF documents
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!isSignedIn && (
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Secure Your Code?
            </h2>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white font-bold py-5 px-12 rounded-xl hover:from-primary-700 hover:via-secondary-700 hover:to-accent-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-glow-lg text-lg animate-gradient">
                Get Started Free
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2 text-gray-300 font-semibold">VulnVault - Secure Your Applications</p>
          <p className="text-sm text-gray-500">Powered by AI • Built with FastAPI, React & MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
