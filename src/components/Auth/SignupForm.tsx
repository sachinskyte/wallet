import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('hacker');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate form
    if (!name.trim()) {
      setValidationError('Please enter your name');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) throw error;
      
      if (data.user) {
        // If verification is not required or session is available, redirect to dashboard directly
        if (data.session) {
          navigate('/dashboard');
        } else {
          // Check if we can auto-sign in to avoid extra steps
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (!signInError && signInData.session) {
              navigate('/dashboard');
              return;
            }
          } catch (autoSignInError) {
            console.error('Auto sign-in failed:', autoSignInError);
          }
          
          // If email verification is required or auto-signin failed
          setEmailSent(true);
          toast({
            title: 'Account created',
            description: 'Please check your email to confirm your account or proceed to login',
          });
        }
      } else {
        throw new Error('Something went wrong during signup');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      setValidationError(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md p-6 cyber-panel animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <ShieldAlert className="h-8 w-8 text-cyber-teal mr-2" />
            <h1 className="text-2xl font-bold tracking-tighter">
              <span className="text-cyber-teal">SENTRYL</span>
            </h1>
          </div>
        </div>
        
        <div className="bg-cyber-teal/20 border border-cyber-teal/30 text-white px-4 py-6 rounded mb-4 text-center">
          <h2 className="text-xl font-bold mb-4">Account Created!</h2>
          <p className="mb-4">
            Your account has been created successfully. You can now <strong>sign in</strong> with your credentials.
          </p>
        </div>
        
        <Link to="/login" className="cyber-button w-full py-3 block text-center">
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 cyber-panel animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <ShieldAlert className="h-8 w-8 text-cyber-teal mr-2" />
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-cyber-teal">SENTRYL</span>
          </h1>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-6 text-center text-white">Create Your Account</h2>
      
      {validationError && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded mb-4">
          {validationError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="cyber-input"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cyber-input"
            placeholder="you@example.com"
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="cyber-input pr-10"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`${
                role === 'hacker'
                  ? 'bg-cyber-teal/20 border-cyber-teal'
                  : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
              } border rounded-md py-2 px-3 flex items-center justify-center`}
              onClick={() => setRole('hacker')}
            >
              <span className="text-sm font-medium">Ethical Hacker</span>
            </button>
            
            <button
              type="button"
              className={`${
                role === 'security'
                  ? 'bg-cyber-teal/20 border-cyber-teal'
                  : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
              } border rounded-md py-2 px-3 flex items-center justify-center`}
              onClick={() => setRole('security')}
            >
              <span className="text-sm font-medium">Security Team</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 bg-cyber-light border-cyber-teal/30 rounded text-cyber-teal focus:ring-cyber-teal"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
            I agree to the{' '}
            <a href="#" className="cyber-link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="cyber-link">
              Privacy Policy
            </a>
          </label>
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
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </span>
          )}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="cyber-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
