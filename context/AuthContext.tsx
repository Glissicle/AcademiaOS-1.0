import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { User } from '../types';

// This is a MOCK authentication service.
// In a real app, you would replace this with calls to Firebase Auth, Netlify Identity, etc.
const authService = {
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    // Check if a user session exists in local storage
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      callback(JSON.parse(storedUser));
    } else {
      callback(null);
    }
    // This doesn't need a real listener for this mock, but a real implementation would.
    return () => {}; // Return an unsubscribe function
  },
  login: async (email: string): Promise<User> => {
    console.log(`Logging in ${email}`);
    const user = { uid: 'mock-uid-' + email, email: email };
    localStorage.setItem('authUser', JSON.stringify(user));
    // In a real app, you would also need to sync data from backend here.
    return user;
  },
  signup: async (email: string): Promise<User> => {
    console.log(`Signing up ${email}`);
    const user = { uid: 'mock-uid-' + email, email: email };
    localStorage.setItem('authUser', JSON.stringify(user));
    // In a real app, you would create a new user document in your database here.
    return user;
  },
  logout: async (): Promise<void> => {
    console.log('Logging out');
    localStorage.removeItem('authUser');
    // Here you might want to clear local data or handle guest session
  },
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email: string, _pass: string) => authService.login(email).then(setUser);
  const signup = (email: string, _pass: string) => authService.signup(email).then(setUser);
  const logout = () => authService.logout().then(() => setUser(null));

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
