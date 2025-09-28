import { useState, useCallback, useMemo, memo, type RefObject } from "react";
import { Button } from "../ui/button";
import { LoginForm, useAuth, type User } from "../auth";
import { useClickOutside, useMobileMenu } from "../../lib/hooks";

/**
 * Props dla komponentu Navigation
 */
interface NavigationProps {
  /** Tytuł wyświetlany w nawigacji */
  title: string;
}

/**
 * Komponent nawigacji z responsywnym menu mobilnym i formularzem logowania
 *
 * @param title - tytuł wyświetlany w nawigacji
 */
export const Navigation = memo(function Navigation({ title }: NavigationProps) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isOpen: showMobileMenu, closeMenu: closeMobileMenu, toggleMenu: toggleMobileMenu } = useMobileMenu();

  // Ref dla formularza logowania
  const loginFormRef = useClickOutside<HTMLDivElement>(
    showLoginForm,
    useCallback(() => setShowLoginForm(false), []),
    ['button[aria-label*="Zaloguj"]', 'button:has-text("Zaloguj")']
  );

  // Ref dla menu mobilnego
  const mobileMenuRef = useClickOutside<HTMLDivElement>(showMobileMenu, closeMobileMenu);

  // Handlery z optymalizacją wydajności
  const handleLoginToggle = useCallback(() => {
    setShowLoginForm((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginForm(false);
    closeMobileMenu();
  }, [closeMobileMenu]);

  // Memoizowane komponenty dla optymalizacji wydajności
  const NavigationLinks = useMemo(
    () => (
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
    ),
    []
  );

  const UserInfo = useMemo(() => {
    if (!isAuthenticated || !user) return null;

    return (
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-purple-200 text-sm">
            Witaj, <span className="font-semibold text-white">{user.username}</span>
          </div>
          {user.roles && user.roles.length > 0 && (
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
    );
  }, [isAuthenticated, user, logout]);

  const LoginButton = useMemo(
    () => (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoginToggle}
          className="bg-purple-600/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 hover:border-purple-300/70 hover:text-white transition-all duration-200"
        >
          Zaloguj się
        </Button>
        {showLoginForm && (
          <div ref={loginFormRef}>
            <LoginForm onClose={handleLoginSuccess} isMobile={false} />
          </div>
        )}
      </div>
    ),
    [showLoginForm, handleLoginToggle, handleLoginSuccess, loginFormRef]
  );

  const MobileMenuButton = useMemo(
    () => (
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobileMenu}
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
    ),
    [showMobileMenu, toggleMobileMenu]
  );

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
          {NavigationLinks}

          {/* Right Section - Desktop Login/User + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Login/User Section - Desktop */}
            <div className="hidden md:block flex-shrink-0 relative z-[100]">
              {isAuthenticated ? UserInfo : LoginButton}
            </div>

            {/* Mobile Menu Button */}
            {MobileMenuButton}
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={showMobileMenu}
          menuRef={mobileMenuRef}
          onLinkClick={handleMobileLinkClick}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
          onLoginToggle={handleLoginToggle}
          loginFormRef={loginFormRef}
        />

        {/* Mobile Login Form - Poza menu mobilnym */}
        {showLoginForm && <MobileLoginForm onClose={handleLoginSuccess} loginFormRef={loginFormRef} />}
      </div>
    </nav>
  );
});

/**
 * Props dla komponentu MobileMenu
 */
interface MobileMenuProps {
  /** Czy menu jest otwarte */
  isOpen: boolean;
  /** Ref do elementu menu */
  menuRef: RefObject<HTMLDivElement>;
  /** Callback wywoływany przy kliknięciu w link */
  onLinkClick: () => void;
  /** Czy użytkownik jest zalogowany */
  isAuthenticated: boolean;
  /** Dane użytkownika */
  user: User | null;
  /** Callback wywoływany przy wylogowaniu */
  onLogout: () => void;
  /** Callback wywoływany przy przełączaniu formularza logowania */
  onLoginToggle: () => void;
  /** Ref do formularza logowania */
  loginFormRef: RefObject<HTMLDivElement>;
}

const MobileMenu = memo(function MobileMenu({
  isOpen,
  menuRef,
  onLinkClick,
  isAuthenticated,
  user,
  onLogout,
  onLoginToggle,
  loginFormRef,
}: MobileMenuProps) {
  const MobileNavigationLinks = useMemo(
    () => (
      <>
        <a
          href="/"
          onClick={onLinkClick}
          className="block text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
        >
          Strona główna
        </a>
        <a
          href="/endpoints"
          onClick={onLinkClick}
          className="block text-purple-200 hover:text-white hover:bg-purple-700/50 px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
        >
          Endpoints
        </a>
      </>
    ),
    [onLinkClick]
  );

  const MobileUserSection = useMemo(() => {
    if (isAuthenticated && user) {
      return (
        <div className="space-y-3">
          <div className="px-3 py-2">
            <div className="text-purple-200 text-sm">
              Witaj, <span className="font-semibold text-white">{user.username}</span>
            </div>
            {user.roles && user.roles.length > 0 && (
              <div className="text-xs text-purple-300 mt-1">Role: {user.roles.join(", ")}</div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="w-full bg-red-600/20 border-red-400/50 text-red-200 hover:bg-red-500/30 hover:border-red-300/70 hover:text-white transition-all duration-200"
          >
            Wyloguj się
          </Button>
        </div>
      );
    }

    return (
      <div className="relative w-full" ref={loginFormRef}>
        <Button
          variant="outline"
          size="sm"
          onClick={onLoginToggle}
          className="w-full bg-purple-600/20 border-purple-400/50 text-purple-200 hover:bg-purple-500/30 hover:border-purple-300/70 hover:text-white transition-all duration-200"
        >
          Zaloguj się
        </Button>
      </div>
    );
  }, [isAuthenticated, user, onLogout, onLoginToggle, loginFormRef]);

  return (
    <div
      ref={menuRef}
      className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
      } overflow-hidden`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900/50 backdrop-blur-sm border-t border-purple-700/50">
        {/* Navigation Links */}
        {MobileNavigationLinks}

        {/* Mobile Login/User Section */}
        <div className="pt-2 border-t border-purple-700/50">{MobileUserSection}</div>
      </div>
    </div>
  );
});

/**
 * Props dla komponentu MobileLoginForm
 */
interface MobileLoginFormProps {
  /** Callback wywoływany przy zamknięciu formularza */
  onClose: () => void;
  /** Ref do formularza logowania */
  loginFormRef: RefObject<HTMLDivElement>;
}

const MobileLoginForm = memo(function MobileLoginForm({ onClose, loginFormRef }: MobileLoginFormProps) {
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className="fixed inset-0 z-[10000] md:hidden">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Zamknij formularz logowania"
      />
      <div className="flex items-center justify-center min-h-screen p-4" ref={loginFormRef}>
        <LoginForm onClose={onClose} isMobile={true} />
      </div>
    </div>
  );
});
