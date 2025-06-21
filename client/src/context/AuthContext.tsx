import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  mobileNumber: string;
  name?: string;
  username?: string;
  email?: string;
  dateOfBirth?: string;
  profileImage?: string;
  address?: string;
  hobbies?: string;
  bio?: string;
  profileCompleted: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  error: string | null;
  login: (mobileNumber: string) => Promise<{success: boolean, otp?: string}>;
  verifyOtp: (mobileNumber: string, otp: string) => Promise<boolean>;
  updateProfile: (userId: number, profileData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Failed to parse saved user
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (mobileNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/auth/request-otp', { mobileNumber });
      setIsLoading(false);
      return { success: true, otp: response?.otp as string };
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to send OTP');
      return { success: false };
    }
  };

  const verifyOtp = async (mobileNumber: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/auth/verify-otp', { mobileNumber, otp });
      if (response?.user) {
        setUser(response.user as User);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to verify OTP');
      return false;
    }
  };

  const updateProfile = async (userId: number, profileData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await apiRequest('PUT', `/api/users/${userId}/profile`, profileData);
      
      if (updatedUser) {
        setUser(updatedUser as User);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setIsLoading(false);
      return true;
    } catch (err: any) {
      // Handle profile update error silently
      setIsLoading(false);
      setError(err.message || 'Failed to update profile');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isProfileComplete: user ? user.profileCompleted : false,
        isLoading,
        error,
        login,
        verifyOtp,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};