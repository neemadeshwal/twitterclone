// contexts/AuthContext.tsx
"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter,usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
  // Add other auth-related functions as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname=usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password'];
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
          
          // Redirect authenticated users away from login pages
          if (isPublicRoute) {
            router.push('/');
          }
        } else {
          setIsAuthenticated(false);
          
          // Redirect unauthenticated users from protected routes
          if (!isPublicRoute) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          router.push('/login');
        }
      } finally {
        setIsAuthLoading(false);
      }
    }

    checkAuthStatus();
  }, [pathname]);

  // Logout function
// Logout function in AuthContext
const logout = async () => {
    try {
      // Remove the cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const value = {
    isAuthenticated,
    isAuthLoading,
    logout
    // Add other auth-related functions here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}