import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

export default function Header() {
  const { isSignedIn, user } = useUser()

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">VulnVault</h1>
              <p className="text-gray-400 text-sm font-medium">AI-Powered Security Scanner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="text-gray-300 text-sm hidden md:block">
                  Welcome, <span className="font-semibold text-white">{user.firstName || user.emailAddresses[0].emailAddress}</span>
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-primary-400 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Alerts Active
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-primary-500/50 hover:ring-primary-400 transition-all"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm font-semibold shadow-md">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>Online
                </span>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-primary-500/50 transform hover:-translate-y-0.5 transition-all duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-secondary-500/50 transform hover:-translate-y-0.5 transition-all duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
