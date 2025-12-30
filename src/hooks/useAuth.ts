import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/core/types/index.types';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('useAuth - Checking auth status:', { userStr, token });
      
      if (userStr && token) {
        const userData: IUser = JSON.parse(userStr);
        console.log('useAuth - User authenticated:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log('useAuth - No user data found');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const login = (userData: IUser, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    user,
    loading,
    logout,
    login,
    checkAuthStatus,
  };
}
