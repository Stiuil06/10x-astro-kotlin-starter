import { AuthProvider } from "../auth";
import { Navigation } from "./Navigation";

interface AppWrapperProps {
  children: React.ReactNode;
  title: string;
}

export function AppWrapper({ children, title }: AppWrapperProps) {
  return (
    <AuthProvider>
      <Navigation title={title} />
      {children}
    </AuthProvider>
  );
}
