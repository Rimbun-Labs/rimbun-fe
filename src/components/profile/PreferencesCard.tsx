
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/contexts/ProfileContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Palette, Globe } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const PreferencesCard = () => {
  const { profile, isLoading, updateProfileData, isEditing } = useProfile();
  const { theme, setTheme } = useTheme();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) return null;
  
  const handleThemeChange = (value: string) => {
    const themeValue = value as 'light' | 'dark' | 'system';
    updateProfileData({
      preferences: {
        ...profile.preferences,
        theme: themeValue
      }
    });
    setTheme(themeValue);
  };
  
  const handleLanguageChange = (value: string) => {
    updateProfileData({
      preferences: {
        ...profile.preferences,
        language: value
      }
    });
  };
  
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" }
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <div className="flex-1">
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </div>
        <Palette className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="theme" className="font-medium">Theme</Label>
            {profile.preferences.theme === 'light' ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : profile.preferences.theme === 'dark' ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : null}
          </div>
          <Select
            value={profile.preferences.theme}
            onValueChange={handleThemeChange}
            disabled={!isEditing}
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="language" className="font-medium">Language</Label>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <Select
            value={profile.preferences.language}
            onValueChange={handleLanguageChange}
            disabled={!isEditing}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesCard;
