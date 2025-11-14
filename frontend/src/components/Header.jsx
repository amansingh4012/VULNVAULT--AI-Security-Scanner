import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

export default function Header() {
  const { isSignedIn, user } = useUser()

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🛡️</div>
            <div>
              <h1 className="text-3xl font-bold text-white">VulnVault</h1>
              <p className="text-gray-400 text-sm">AI-Powered Security Scanner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="text-gray-300 text-sm">
                  Welcome, <span className="font-medium text-white">{user.firstName || user.emailAddresses[0].emailAddress}</span>
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  📧 Alerts Active
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  ✓ Online
                </span>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
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
