
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileDisplayProps {
  avatarUrl: string | null;
  fullName: string | null;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ 
  avatarUrl, 
  fullName, 
  showEditButton = false,
  onEditClick 
}) => {
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Generate avatar URL when avatarUrl prop changes
    if (avatarUrl) {
      setAvatarSrc(`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarUrl}`);
    }
  }, [avatarUrl]);
  
  const initials = fullName 
    ? fullName.split(' ').map(name => name[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="flex items-center mb-6">
      <Avatar className="w-16 h-16 rounded-full bg-cyber-teal/20 border border-cyber-teal/30 mr-4 overflow-hidden">
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} alt="User Avatar" className="w-full h-full object-cover" />
        ) : (
          <AvatarFallback className="text-cyber-teal text-2xl font-bold">{initials}</AvatarFallback>
        )}
      </Avatar>
      
      <div>
        <h3 className="text-lg font-semibold text-white">{fullName || 'Anonymous User'}</h3>
        {showEditButton && (
          <button 
            className="cyber-button-outline text-sm mt-1"
            onClick={onEditClick}
          >
            Change Avatar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDisplay;
