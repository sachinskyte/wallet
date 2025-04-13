import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Languages } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AvatarSelection from '@/components/Settings/AvatarSelection';
import ProfileDisplay from '@/components/Settings/ProfileDisplay';
import { generateDemoProfile } from '@/utils/demoProfile';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('avatar-1');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [demoProfile, setDemoProfile] = useState(generateDemoProfile());
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || 'avatar-1');
    } else if (!isLoading && !user) {
      setName(demoProfile.full_name || '');
      setEmail(demoProfile.email || '');
      setBio(demoProfile.bio || '');
      setAvatarUrl(demoProfile.avatar_url || 'avatar-1');
    }
  }, [profile, isLoading, user, demoProfile]);

  const handleSaveChanges = async () => {
    if (!user) {
      toast({
        title: "Demo Mode",
        description: "Changes aren't saved in demo mode. Please login to save your profile.",
      });
      return;
    }

    try {
      await updateProfile({
        full_name: name,
        bio,
        avatar_url: avatarUrl,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.full_name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || 'avatar-1');
    } else {
      setName(demoProfile.full_name || '');
      setBio(demoProfile.bio || '');
      setAvatarUrl(demoProfile.avatar_url || 'avatar-1');
    }
    setIsEditing(false);
    setShowAvatarSelector(false);
  };

  const handleSelectAvatar = (id: string) => {
    setAvatarUrl(id);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-cyber-teal/20 text-cyber-teal text-xs font-medium px-2.5 py-0.5 rounded border border-cyber-teal/30">
            Settings
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white flex items-center">
          <SettingsIcon className="h-6 w-6 text-cyber-teal mr-2" />
          Account Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Configure your profile, security preferences, and notification settings
        </p>
        {!user && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-300 text-sm">
            <strong>Note:</strong> You're viewing a demo profile. Login to save your own settings.
          </div>
        )}
      </div>
      
      <div className="cyber-panel p-6 mb-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-cyber-teal/20 pb-4">
          <button 
            className={`${activeTab === 'profile' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            <span>Profile</span>
          </button>
          <button 
            className={`${activeTab === 'security' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-4 w-4 mr-2" />
            <span>Security</span>
          </button>
          <button 
            className={`${activeTab === 'notifications' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </button>
          <button 
            className={`${activeTab === 'appearance' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('appearance')}
          >
            <Moon className="h-4 w-4 mr-2" />
            <span>Appearance</span>
          </button>
          <button 
            className={`${activeTab === 'language' ? 'bg-cyber-teal text-white' : 'hover:bg-cyber-teal/20 text-gray-300'} px-4 py-2 rounded-md flex items-center`}
            onClick={() => setActiveTab('language')}
          >
            <Languages className="h-4 w-4 mr-2" />
            <span>Language</span>
          </button>
        </div>
        
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Profile Information</h2>
            
            <div className="space-y-4">
              {showAvatarSelector ? (
                <AvatarSelection 
                  selectedAvatar={avatarUrl} 
                  onSelect={handleSelectAvatar} 
                />
              ) : (
                <ProfileDisplay 
                  avatarUrl={avatarUrl}
                  fullName={name}
                  showEditButton={true}
                  onEditClick={() => setShowAvatarSelector(true)}
                />
              )}
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Email Address</label>
                <input 
                  type="email" 
                  className="cyber-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={true}
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1 text-sm">Bio</label>
                <textarea 
                  className="cyber-input min-h-[100px]" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                ></textarea>
              </div>
              
              <div className="pt-4 flex gap-3">
                {isEditing ? (
                  <>
                    <button 
                      className="cyber-button"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="cyber-button-outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="cyber-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'profile' && (
          <div className="text-center py-10">
            <h3 className="text-xl text-gray-400">This section is under development</h3>
            <p className="text-gray-500 mt-2">Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
