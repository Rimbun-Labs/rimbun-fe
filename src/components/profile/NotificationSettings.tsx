
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/contexts/ProfileContext';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';

const NotificationSettings = () => {
  const { profile, isLoading, updateProfileData, isEditing } = useProfile();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) return null;
  
  const { notificationSettings } = profile.preferences;
  
  const handleToggle = (key: keyof typeof notificationSettings, value: boolean) => {
    updateProfileData({
      preferences: {
        ...profile.preferences,
        notificationSettings: {
          ...profile.preferences.notificationSettings,
          [key]: value
        }
      }
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <div className="flex-1">
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </div>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive updates, alerts, and important information via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notificationSettings.email}
              onCheckedChange={(checked) => handleToggle('email', checked)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive real-time alerts on your device
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notificationSettings.push}
              onCheckedChange={(checked) => handleToggle('push', checked)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingNotifications" className="font-medium">
                Marketing Communications
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive offers, promotions, and feature updates
              </p>
            </div>
            <Switch
              id="marketingNotifications"
              checked={notificationSettings.marketing}
              onCheckedChange={(checked) => handleToggle('marketing', checked)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
