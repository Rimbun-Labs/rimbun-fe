
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile, getProfile, updateProfile } from '@/lib/api/profileApi';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/lib/api/userService';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  unsavedChanges: boolean;
  setIsEditing: (value: boolean) => void;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  discardChanges: () => void;
  refreshProfile: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchProfile = async () => {
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get the database user ID
      const databaseUserId = userService.getDatabaseUserId();
      if (!databaseUserId) {
        setError('User profile not found. Please complete your registration.');
        setIsLoading(false);
        return;
      }

      const data = await getProfile(databaseUserId);
      setProfile(data);
      setOriginalProfile(data);
    } catch (err) {
      setError('Failed to load profile data');
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (originalProfile && profile) {
      setUnsavedChanges(JSON.stringify(originalProfile) !== JSON.stringify(profile));
    }
  }, [originalProfile, profile]);
  
  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setProfile(prev => prev ? { ...prev, ...data } : null);
      if (!isEditing) {
        setIsLoading(true);
        const databaseUserId = userService.getDatabaseUserId();
        if (!databaseUserId) {
          throw new Error('User profile not found');
        }
        await updateProfile(databaseUserId, data);
        setOriginalProfile(prev => prev ? { ...prev, ...data } : null);
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (err) {
      setError('Failed to update profile');
      toast({
        title: 'Error',
        description: 'Failed to update profile data',
        variant: 'destructive',
      });
    } finally {
      if (!isEditing) {
        setIsLoading(false);
      }
    }
  };
  
  const saveProfileChanges = async () => {
    if (!profile || !user) return;
    
    try {
      setIsLoading(true);
      const databaseUserId = userService.getDatabaseUserId();
      if (!databaseUserId) {
        throw new Error('User profile not found');
      }
      await updateProfile(databaseUserId, profile);
      setOriginalProfile(profile);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (err) {
      setError('Failed to save profile changes');
      toast({
        title: 'Error',
        description: 'Failed to save profile changes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const discardChanges = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };
  
  const updateProfilePictureHandler = async (file: File) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      const url = URL.createObjectURL(file);
      updateProfileData({ profilePicture: url });
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
    } catch (err) {
      setError('Failed to update profile picture');
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshProfile = async () => {
    await fetchProfile();
  };
  
  useEffect(() => {
    if (isEditing && unsavedChanges) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isEditing, unsavedChanges]);
  
  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        isEditing,
        unsavedChanges,
        setIsEditing: (value) => {
          setIsEditing(value);
          if (value === false && unsavedChanges) {
            saveProfileChanges();
          }
        },
        updateProfileData,
        updateProfilePicture: updateProfilePictureHandler,
        discardChanges,
        refreshProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  
  return context;
};
