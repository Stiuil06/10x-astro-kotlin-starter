import { useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import { MieszkaniecOnly } from './PermissionWrapper';
import { Role } from '../types';

function AuthSection() {
  const { isAuthenticated, username: loggedInUsername, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoginSuccess = (token: string, user: string, roles: any[]) => {
    // Store login time for session management
    localStorage.setItem('loginTime', new Date().toISOString());
    // Close dropdown
    setIsOpen(false);
    // The AuthContext will handle the login state
    window.location.reload(); // Simple way to refresh auth state
  };

  const handleLoginError = (error: string) => {
    // Error handling is done in LoginForm component
    console.error('Login error:', error);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">
          Zalogowany jako: <span className="font-semibold text-blue-600">{loggedInUsername}</span>
        </span>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          Wyloguj
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        Zaloguj się
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Logowanie</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <LoginForm 
              onLoginSuccess={handleLoginSuccess}
              onLoginError={handleLoginError}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Home link */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              Wspólnota Okrzei 41B
            </a>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Strona główna
            </a>
            <MieszkaniecOnly>
              <a 
                href="/report-issue" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Zgłoś problem
              </a>
            </MieszkaniecOnly>
            <MieszkaniecOnly>
              <a 
                href="/decisions" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Log decyzji
              </a>
            </MieszkaniecOnly>
            <a 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Kontakt
            </a>
          </div>

          {/* Auth section */}
          <div className="flex items-center space-x-4">
            <AuthSection />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="/" 
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Strona główna
            </a>
            <a 
              href="/report-issue" 
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Zgłoś problem
            </a>
            <MieszkaniecOnly>
              <a 
                href="/decisions" 
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Log decyzji
              </a>
            </MieszkaniecOnly>
            <a 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}