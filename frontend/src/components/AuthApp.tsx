import { AuthProvider, useAuth } from './AuthContext';
import UserList from './UserList';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

function App() {
  const { isAuthenticated, isLoading, login } = useAuth();

  const handleLoginSuccess = (token: string, username: string) => {
    login(token, username);
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Ładowanie...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isAuthenticated ? (
        <>
          <UserProfile />
          <UserList />
        </>
      ) : (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      )}
    </div>
  );
}

export default function AuthApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
