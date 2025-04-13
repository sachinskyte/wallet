import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError, WeakPassword } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  email: string | null;
  avatar_url: string | null;
};

type AuthResponse = {
  data: {
    user: User | null;
    session: Session | null;
    weakPassword?: WeakPassword | null;
  };
  error: AuthError | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for changes to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching profile for user:", userId);
      
      // Special case for admin user
      if (userId === 'admin-id') {
        setProfile({
          id: 'admin-id',
          full_name: 'Admin User',
          bio: 'System administrator',
          email: 'sentryl@example.com',
          avatar_url: 'avatar-admin',
        });
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error fetching profile',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data) {
        console.log("Profile fetched:", data);
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Special case for admin login
      if (email === 'sentryl' && password === 'senetinalsyncadmin7026228628') {
        // Create a simulated admin session
        const adminUser = {
          id: 'admin-id',
          email: 'sentryl@example.com',
          app_metadata: { provider: 'email' },
          user_metadata: { full_name: 'Admin User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        
        setUser(adminUser);
        setProfile({
          id: 'admin-id',
          full_name: 'Admin User',
          bio: 'System administrator',
          email: 'sentryl@example.com',
          avatar_url: 'avatar-admin',
        });
        
        toast({
          title: 'Admin Access Granted',
          description: 'Welcome to the admin dashboard',
        });
        
        return {
          data: {
            user: adminUser,
            session: { user: adminUser } as Session,
          },
          error: null,
        };
      }
      
      // Special case for demo login
      if (email === 'demo' && password === 'demo123') {
        // Create a simulated demo session
        const demoUser = {
          id: 'demo-id',
          email: 'demo@example.com',
          app_metadata: { provider: 'email' },
          user_metadata: { full_name: 'Demo User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;
        
        setUser(demoUser);
        setProfile({
          id: 'demo-id',
          full_name: 'Demo User',
          bio: 'This is a demo account',
          email: 'demo@example.com',
          avatar_url: 'avatar-5',
        });
        
        toast({
          title: 'Demo Mode',
          description: 'You are now using the demo account',
        });
        
        return {
          data: {
            user: demoUser,
            session: { user: demoUser } as Session,
          },
          error: null,
        };
      }
      
      // Regular user login
      const response = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (response.error) {
        toast({
          title: 'Error signing in',
          description: response.error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in',
        });
      }
      
      return response as AuthResponse;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (response.error) {
        toast({
          title: 'Error signing up',
          description: response.error.message,
          variant: 'destructive',
        });
      } else if (response.data.user && !response.data.user.identities?.length) {
        // User already exists error
        const error = new Error('The email address is already registered');
        toast({
          title: 'Error signing up',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      } else {
        toast({
          title: 'Welcome!',
          description: 'Account created successfully',
        });
      }
      
      return response as AuthResponse;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Check if it's the admin or demo user (simulated session)
      if (user?.id === 'admin-id' || user?.id === 'demo-id') {
        setUser(null);
        setProfile(null);
        setSession(null);
        
        toast({
          title: 'Signed out',
          description: 'You have been signed out successfully',
        });
        return;
      }
      
      // Regular sign out for Supabase users
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Error signing out',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Demo or admin users can't update their profiles
      if (user.id === 'admin-id' || user.id === 'demo-id') {
        toast({
          title: "Demo Mode",
          description: "Profile updates aren't saved in demo mode.",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast({
          title: 'Error updating profile',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
