import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());

  useEffect(() => {
    // Check if user is authenticated on mount
    if (api.isAuthenticated()) {
      setIsAuthenticated(true);
      // In a real app, you'd fetch user details here
    }
  }, []);

  const login = async (username: string, password: string) => {
    await api.login(username, password);
    setIsAuthenticated(true);
    // Mock user data - in real app, fetch from API
    setUser({ id: 1, username, email: '', first_name: '', last_name: '' });
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => {
    await api.register(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.is_staff || false,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
