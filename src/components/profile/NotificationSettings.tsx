
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/contexts/ProfileContext';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationSettings = () => {
  const { profile, isLoading, updateProfileData, isEditing } = useProfile();
  
  if (isLoading) {
    return (
      <Card className="border border-border shadow-lg">
        <CardHeader className="pb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-8">
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
    <Card className="border border-border shadow-lg w-full max-w-none">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-6">
        <div className="flex-1">
          <CardTitle className="text-foreground">Notification Settings</CardTitle>
          <CardDescription className="text-muted-foreground">Control how and when you receive notifications</CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bell className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-2">
              <Label htmlFor="emailNotifications" className="font-medium text-foreground">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
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
          
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-2">
              <Label htmlFor="pushNotifications" className="font-medium text-foreground">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
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
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="marketingNotifications" className="font-medium text-foreground">
              Marketing Communications
            </Label>
            <p className="text-sm text-muted-foreground">
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
        
        {/* Action Buttons for Visual Balance */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Notification settings are automatically saved as you make changes
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-border hover:bg-muted hover:text-foreground h-11 px-6"
              >
                Reset to Defaults
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-6"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
