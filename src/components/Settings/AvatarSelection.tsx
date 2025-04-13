
import React from 'react';
import { cn } from '@/lib/utils';

// More realistic avatar selection options with consistent seed values
const avatars = [
  { id: 'avatar-1', seed: 'avatar1', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar1' },
  { id: 'avatar-2', seed: 'avatar2', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar2' },
  { id: 'avatar-3', seed: 'avatar3', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar3' },
  { id: 'avatar-4', seed: 'avatar4', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar4' },
  { id: 'avatar-5', seed: 'avatar5', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar5' },
  { id: 'avatar-6', seed: 'avatar6', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar6' },
  { id: 'avatar-7', seed: 'avatar7', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar7' },
  { id: 'avatar-8', seed: 'avatar8', src: 'https://api.dicebear.com/7.x/bottts/svg?seed=avatar8' },
];

interface AvatarSelectionProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ selectedAvatar, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Choose Avatar</h3>
      <div className="flex flex-wrap gap-4">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={cn(
              "w-16 h-16 rounded-full overflow-hidden border-2 transition-all",
              selectedAvatar === avatar.id 
                ? "border-cyber-teal ring-2 ring-cyber-teal/50 scale-105" 
                : "border-transparent hover:border-cyber-teal/50"
            )}
            aria-label={`Select avatar ${avatar.id}`}
          >
            <img 
              src={avatar.src} 
              alt={`Avatar ${avatar.id}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelection;
