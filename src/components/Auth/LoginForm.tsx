import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldAlert, StarIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data } = await signIn(email, password);
      if (data && data.session) {
        // If admin user, redirect to admin page
        if (email === 'sentryl') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo');
    setPassword('demo123');
    
    setIsLoading(true);
    try {
      const { data } = await signIn('demo', 'demo123');
      if (data && data.session) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      toast({
        title: 'Email required',
        description: 'Please enter your email address to receive a magic link',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
      setMagicLinkSent(true);
      toast({
        title: 'Magic link sent',
        description: 'Check your email for a login link',
      });
    } catch (error: any) {
      console.error('Magic link error:', error);
      setError(error.message || 'Failed to send magic link');
      toast({
        title: 'Error',
        description: error.message || 'Failed to send magic link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md p-6 cyber-panel animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <img src="/shield-logo.svg" alt="Sentryl" className="h-10 w-10 mr-2" />
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-cyber-teal">SENTRYL</span>
            </h1>
          </div>
        </div>
        
        <div className="bg-cyber-teal/20 border border-cyber-teal/30 text-white px-4 py-6 rounded mb-4 text-center">
          <h2 className="text-xl font-bold mb-4">Magic Link Sent</h2>
          <p className="mb-4">
            We've sent a login link to <strong>{email}</strong>. 
            Please check your inbox and click the link to sign in.
          </p>
          <p className="text-sm text-gray-300">
            If you don't see the email, please check your spam folder.
          </p>
        </div>
        
        <button 
          onClick={() => setMagicLinkSent(false)}
          className="cyber-button-outline w-full py-3"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 cyber-panel animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <img src="/shield-logo.svg" alt="Sentryl" className="h-10 w-10 mr-2" />
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-cyber-teal">SENTRYL</span>
          </h1>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-6 text-center text-white">Access Your Account</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address or Username
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cyber-input"
            placeholder="you@example.com or username"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 bg-cyber-light border-cyber-teal/30 rounded text-cyber-teal focus:ring-cyber-teal"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
              Remember me
            </label>
          </div>
          
          <button 
            onClick={handleMagicLink}
            className="text-sm text-cyber-teal hover:text-cyber-cyan"
          >
            Login with magic link
          </button>
        </div>
        
        <button
          type="submit"
          className="cyber-button w-full py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In
            </span>
          )}
        </button>
        
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cyber-teal/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-cyber-dark px-2 text-sm text-gray-400">Or</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleDemoLogin}
          className="cyber-button-outline w-full py-3 flex items-center justify-center"
        >
          <span className="flex items-center justify-center">
            Try Demo Account
          </span>
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="cyber-link">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
