import { AuthProvider } from './AuthContext';
import Navigation from './Navigation';

export default function NavigationWrapper() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
