import { useAuth, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is signed in, redirect to file upload
    if (isSignedIn) {
      navigate('/scan');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            🛡️ VulnVault
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            AI-Powered Security Vulnerability Scanner
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
            Detect security vulnerabilities in your code and dependencies with advanced AI analysis. 
            Keep your applications secure with real-time scanning and actionable insights.
          </p>
          
          {!isSignedIn && (
            <div className="flex justify-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-lg">
                  🔐 Sign In to Get Started
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-4">Code Scanning</h3>
            <p className="text-gray-300">
              Upload source code files in Python, JavaScript, C++, Java, and more. 
              Detects SQL injection, XSS, hardcoded secrets, and 50+ vulnerability types.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-4">Dependency Scanning</h3>
            <p className="text-gray-300">
              Scan package.json and requirements.txt for known vulnerabilities. 
              Supports npm and pip with real-time CVE database lookup.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400 transition-all">
            <div className="text-5xl mb-4">🐙</div>
            <h3 className="text-2xl font-bold text-white mb-4">GitHub Scanning</h3>
            <p className="text-gray-300">
              Scan entire GitHub repositories by URL. 
              Analyzes multiple files, dependencies, and secrets across your project.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            🔍 How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Sign In</h4>
              <p className="text-gray-300 text-sm">
                Create a free account with Clerk authentication
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Upload Code</h4>
              <p className="text-gray-300 text-sm">
                Upload files, dependency lists, or provide GitHub URL
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-300 text-sm">
                Advanced scanners detect vulnerabilities & generate security score
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Get Results</h4>
              <p className="text-gray-300 text-sm">
                View detailed reports with AI-powered fix suggestions
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-12 border border-purple-400/30">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            ✨ Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">AI-Powered Fix Suggestions</h4>
                <p className="text-gray-300">
                  Get intelligent fix recommendations powered by Google Gemini AI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">🔐</div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Secret Detection</h4>
                <p className="text-gray-300">
                  Finds hardcoded API keys, passwords, and tokens in your code
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Email Alerts</h4>
                <p className="text-gray-300">
                  Instant notifications for critical vulnerabilities to your email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">💾</div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Saved Projects</h4>
                <p className="text-gray-300">
                  Store scan history and track security improvements over time
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Security Score</h4>
                <p className="text-gray-300">
                  Get a 0-100 security score based on vulnerability severity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="text-3xl">📄</div>
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
              <button className="bg-white text-purple-900 font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl text-lg">
                Get Started Free →
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">🛡️ VulnVault - Secure Your Applications</p>
          <p className="text-sm">Powered by AI • Built with FastAPI, React & MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
