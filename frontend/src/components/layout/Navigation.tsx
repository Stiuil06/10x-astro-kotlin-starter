import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { LoginForm, useAuth } from "../auth";

interface NavigationProps {
  title: string;
}

export function Navigation({ title }: NavigationProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const loginFormRef = useRef<HTMLDivElement>(null);

  // Użyj AuthContext
  const { user, logout, isAuthenticated } = useAuth();

  // Zamykanie formularza po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginFormRef.current && !loginFormRef.current.contains(event.target as Node)) {
        setShowLoginForm(false);
      }
    };

    if (showLoginForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginForm]);
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

          {/* Navigation Links - Center */}
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

          {/* Login/User Section - Right */}
          <div className="flex-shrink-0 relative z-[100]">
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
                {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
