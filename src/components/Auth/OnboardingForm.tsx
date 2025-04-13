import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Save } from 'lucide-react';
import AvatarSelection from '@/components/Settings/AvatarSelection';

const OnboardingForm: React.FC = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || 'avatar-1');
  const [securityInterest, setSecurityInterest] = useState('web');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await updateProfile({
        full_name: fullName,
        bio,
        avatar_url: avatarUrl
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-6 cyber-panel animate-fade-in">
      <div className="flex justify-center mb-6">
        <Shield className="h-16 w-16 text-cyber-teal" />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2">Welcome to Sentryl</h1>
      <p className="text-center text-gray-400 mb-6">Let's set up your profile</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-cyber-teal/30 pb-2">Your Profile</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Choose Your Avatar</label>
            <AvatarSelection selectedAvatar={avatarUrl} onSelect={setAvatarUrl} />
          </div>
          
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="cyber-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="cyber-input min-h-[100px]"
              placeholder="Tell us about yourself and your security interests..."
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-cyber-teal/30 pb-2">Your Security Interests</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What area of security interests you the most?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`${
                  securityInterest === 'web'
                    ? 'bg-cyber-teal/20 border-cyber-teal'
                    : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
                } border rounded-md py-2 px-3 flex items-center justify-center`}
                onClick={() => setSecurityInterest('web')}
              >
                <span className="text-sm font-medium">Web Security</span>
              </button>
              
              <button
                type="button"
                className={`${
                  securityInterest === 'mobile'
                    ? 'bg-cyber-teal/20 border-cyber-teal'
                    : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
                } border rounded-md py-2 px-3 flex items-center justify-center`}
                onClick={() => setSecurityInterest('mobile')}
              >
                <span className="text-sm font-medium">Mobile Security</span>
              </button>
              
              <button
                type="button"
                className={`${
                  securityInterest === 'network'
                    ? 'bg-cyber-teal/20 border-cyber-teal'
                    : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
                } border rounded-md py-2 px-3 flex items-center justify-center`}
                onClick={() => setSecurityInterest('network')}
              >
                <span className="text-sm font-medium">Network Security</span>
              </button>
              
              <button
                type="button"
                className={`${
                  securityInterest === 'crypto'
                    ? 'bg-cyber-teal/20 border-cyber-teal'
                    : 'bg-cyber-light/20 border-cyber-teal/30 hover:bg-cyber-teal/10'
                } border rounded-md py-2 px-3 flex items-center justify-center`}
                onClick={() => setSecurityInterest('crypto')}
              >
                <span className="text-sm font-medium">Cryptography</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="cyber-button w-full py-3"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Save className="h-5 w-5 mr-2" />
                Complete Setup
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
