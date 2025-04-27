
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProfileHeader = () => {
  const { profile, isLoading, isEditing, unsavedChanges, setIsEditing, discardChanges, updateProfilePicture } = useProfile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateProfilePicture(e.target.files[0]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1 text-center md:text-left">
          <Skeleton className="h-7 w-40 mx-auto md:mx-0" />
          <Skeleton className="h-5 w-60 mx-auto md:mx-0" />
        </div>
      </div>
    );
  }
  
  if (!profile) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-card rounded-lg shadow-sm">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage src={profile.profilePicture} alt={profile.displayName} />
          <AvatarFallback className="text-xl">{getInitials(profile.displayName)}</AvatarFallback>
        </Avatar>
        
        <button 
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
          <span className="sr-only">Update profile picture</span>
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      <div className="space-y-2 flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <Badge variant="outline" className="max-w-fit mx-auto md:mx-0">
            {profile.financialProfile.riskProfile} Risk Profile
          </Badge>
        </div>
        <p className="text-muted-foreground">{profile.email}</p>
      </div>
      
      <div className="flex gap-2 mt-4 md:mt-0">
        {isEditing ? (
          <>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={discardChanges}
              disabled={!unsavedChanges}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsEditing(false)}
              disabled={!unsavedChanges}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
