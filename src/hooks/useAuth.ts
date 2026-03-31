import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'provider' | 'client';
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  authUser: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, userRole: 'provider' | 'client') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setAuthUser(session.user);
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (data) setUser(data);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) setUser(data);
      } else {
        setAuthUser(null);
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signup = async (email: string, password: string, fullName: string, userRole: 'provider' | 'client') => {
    const { data: { user: newUser }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    if (newUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: newUser.id,
          email,
          full_name: fullName,
          role: userRole,
        }]);
      if (insertError) throw new Error(insertError.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
    setAuthUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authUser) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', authUser.id);
    if (error) throw new Error(error.message);
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, authUser, loading, login, signup, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};