import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfile } from '@/contexts/ProfileContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Palette, Globe, AlertCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const PreferencesCard = () => {
  const { profile, isLoading, updateProfileData, isEditing, error } = useProfile();
  const { theme, setTheme } = useTheme();
  
  if (isLoading) {
    return (
      <Card className="border border-border shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground mt-6">Loading preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-border shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center space-y-6 py-12">
            <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Preferences</h3>
              <p className="text-sm text-muted-foreground">
                {error || "Failed to load preferences"}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="border-border hover:bg-muted hover:text-foreground"
            >
              Retry
            </Button>
          </div>
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
    <Card className="border border-border shadow-lg w-full max-w-none">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-6">
        <div className="flex-1">
          <CardTitle className="text-foreground">Preferences</CardTitle>
          <CardDescription className="text-muted-foreground">Customize your app experience</CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Palette className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="theme" className="font-medium text-foreground">Theme</Label>
              {profile.preferences.theme === 'light' ? (
                <div className="p-1 bg-amber-100 rounded-full">
                  <Sun className="h-4 w-4 text-amber-600" />
                </div>
              ) : profile.preferences.theme === 'dark' ? (
                <div className="p-1 bg-slate-100 rounded-full">
                  <Moon className="h-4 w-4 text-slate-600" />
                </div>
              ) : (
                <div className="p-1 bg-primary/10 rounded-full">
                  <Palette className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
            <Select
              value={profile.preferences.theme}
              onValueChange={handleThemeChange}
              disabled={!isEditing}
            >
              <SelectTrigger id="theme" className="w-full border-border focus:border-primary h-11">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="language" className="font-medium text-foreground">Language</Label>
              <div className="p-1 bg-primary/10 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
            </div>
            <Select
              value={profile.preferences.language}
              onValueChange={handleLanguageChange}
              disabled={!isEditing}
            >
              <SelectTrigger id="language" className="w-full border-border focus:border-primary h-11">
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
        </div>
        
        {/* Action Buttons for Visual Balance */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Your preferences are automatically saved as you make changes
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
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesCard;
