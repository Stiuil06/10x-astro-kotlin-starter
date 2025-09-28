import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { LoginForm, useAuth } from "../auth";

interface NavigationProps {
  title: string;
}

export function Navigation({ title }: NavigationProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const loginFormRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Użyj AuthContext
  const { user, logout, isAuthenticated } = useAuth();

  // Zamykanie formularza po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginFormRef.current && !loginFormRef.current.contains(event.target as Node)) {
        setShowLoginForm(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showLoginForm || showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginForm, showMobileMenu]);

  // Zamykanie menu mobilnego po kliknięciu w link
  const handleMobileLinkClick = () => {
    setShowMobileMenu(false);
  };

  // Zamykanie formularza logowania po udanym logowaniu
  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setShowMobileMenu(false);
  };
  return (
    <nav className="bg-gradient-to-r from-purple-800/90 to-indigo-800/90 backdrop-blur-sm shadow-lg border-b border-purple-700/50 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title - Left */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          {/* Navigation Links - Center (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/"
                className="text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Strona główna
              </a>
              <a
                href="/endpoints"
                className="text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Endpoints
              </a>
            </div>
          </div>

          {/* Right Section - Desktop Login/User + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Login/User Section - Desktop */}
            <div className="hidden md:block flex-shrink-0 relative z-[100]">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-purple-200 text-sm">
                      Witaj, <span className="font-semibold text-white">{user?.username}</span>
                    </div>
                    {user?.roles && user.roles.length > 0 && (
                      <div className="text-xs text-purple-300 mt-1">Role: {user.roles.join(", ")}</div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="bg-red-600/20 border-red-400/50 text-red-200 hover:bg-red-500/30 hover:border-red-300/70 hover:text-white transition-all duration-200"
                  >
                    Wyloguj się
                  </Button>
                </div>
              ) : (
                <div className="relative" ref={loginFormRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLoginForm(!showLoginForm)}
                    className="bg-purple-600/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 hover:border-purple-300/70 hover:text-white transition-all duration-200"
                  >
                    Zaloguj się
                  </Button>
                  {showLoginForm && <LoginForm onClose={handleLoginSuccess} isMobile={false} />}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="bg-purple-600/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 hover:border-purple-300/70 hover:text-white transition-all duration-200"
                aria-label="Otwórz menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden transition-all duration-300 ease-in-out ${
            showMobileMenu ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900/50 backdrop-blur-sm border-t border-purple-700/50">
            {/* Navigation Links */}
            <a
              href="/"
              onClick={handleMobileLinkClick}
              className="block text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
            >
              Strona główna
            </a>
            <a
              href="/endpoints"
              onClick={handleMobileLinkClick}
              className="block text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
            >
              Endpoints
            </a>

            {/* Mobile Login/User Section */}
            <div className="pt-2 border-t border-purple-700/50">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="px-3 py-2">
                    <div className="text-purple-200 text-sm">
                      Witaj, <span className="font-semibold text-white">{user?.username}</span>
                    </div>
                    {user?.roles && user.roles.length > 0 && (
                      <div className="text-xs text-purple-300 mt-1">Role: {user.roles.join(", ")}</div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="w-full bg-red-600/20 border-red-400/50 text-red-200 hover:bg-red-500/30 hover:border-red-300/70 hover:text-white transition-all duration-200"
                  >
                    Wyloguj się
                  </Button>
                </div>
              ) : (
                <div className="relative w-full" ref={loginFormRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLoginForm(!showLoginForm)}
                    className="w-full bg-purple-600/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 hover:border-purple-300/70 hover:text-white transition-all duration-200"
                  >
                    Zaloguj się
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Login Form - Poza menu mobilnym */}
        {showLoginForm && (
          <div className="fixed inset-0 z-[10000] md:hidden">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setShowLoginForm(false)}
              onKeyDown={(e) => e.key === "Escape" && setShowLoginForm(false)}
              role="button"
              tabIndex={0}
              aria-label="Zamknij formularz logowania"
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <LoginForm onClose={handleLoginSuccess} isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
