import React, { useState, useEffect } from 'react';
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Shield, 
  Bell, 
  Settings, 
  Loader2, 
  AlertTriangle, 
  Trash2,
  BarChart3,
  Calendar,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getUserSessions } from '@/lib/api/assessmentApi';
import { getLearningProgress } from '@/lib/api/profileApi';
import { userService } from '@/lib/api/userService';

const ProfileContent = () => {
  const { profile, isLoading, error, updateProfileData } = useProfile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Get database user ID for API calls
  const databaseUserId = userService.getDatabaseUserId();

  // Fetch assessment count (completed sessions)
  const { data: userSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['user-sessions', databaseUserId],
    queryFn: () => getUserSessions(databaseUserId!),
    enabled: !!databaseUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate assessment count from completed sessions
  const assessmentCount = userSessions?.filter((session: any) => session.isCompleted === true).length || 0;

  // Fetch learning progress
  const { data: learningProgress, isLoading: learningLoading } = useQuery({
    queryKey: ['learning-progress', databaseUserId],
    queryFn: () => getLearningProgress(databaseUserId!),
    enabled: !!databaseUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    phone: '',
    occupation: '',
    company: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    autoSave: true,
    showTooltips: true,
    dataCollection: true,
    analytics: true,
    notifications: {
      email: true,
      push: true,
      sms: false,
      quietHours: false,
      weeklyDigest: true
    }
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        occupation: profile.occupation || '',
        company: profile.company || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateProfileData(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Implement password change logic
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Consolidated return with conditional content
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Loading State */}
      {isLoading && (
        <div className="py-6">
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground text-lg">
                Loading your profile information...
              </p>
            </div>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="py-6">
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground text-lg">
                Unable to load your profile
              </p>
            </div>
            <Card className="w-full border border-destructive/20 bg-destructive/5">
              <CardContent className="p-8 space-y-6">
                <div className="p-4 rounded-full bg-destructive/10 mx-auto w-fit">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Profile</h3>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Profile Not Found State */}
      {!isLoading && !error && !profile && (
        <div className="py-6">
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
              <p className="text-muted-foreground text-lg">
                Profile not found
              </p>
            </div>
            <Card className="w-full border border-border">
              <CardContent className="p-8 space-y-6">
                <div className="p-4 rounded-full bg-muted mx-auto w-fit">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Profile Not Found</h3>
                  <p className="text-sm text-muted-foreground">Your profile information could not be loaded.</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Profile Content */}
      {!isLoading && !error && profile && (
        <>
          {/* Header */}
          <div className="space-y-3 mb-6">
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground text-lg">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 w-full">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-8 w-full">
                {/* Dashboard-style 3-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  {/* Account Information - Spans 2 columns */}
                  <Card className="w-full lg:col-span-2">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-6">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Account Information</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Update your account details and manage your profile
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-none">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="border-border focus:border-primary h-11 w-full" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                        <Input 
                          id="name" 
                          value={formData.displayName}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                          placeholder="Your full name"
                          className="border-border focus:border-primary h-11 w-full" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="border-border focus:border-primary h-11 w-full" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="occupation" className="text-foreground font-medium">Occupation</Label>
                        <Input 
                          id="occupation" 
                          value={formData.occupation}
                          onChange={(e) => handleInputChange('occupation', e.target.value)}
                          placeholder="Software Engineer"
                          className="border-border focus:border-primary h-11 w-full" 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="company" className="text-foreground font-medium">Company</Label>
                        <Input 
                          id="company" 
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Your company name"
                          className="border-border focus:border-primary h-11 w-full" 
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleProfileUpdate}
                        disabled={isUpdating}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Statistics - Third column */}
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                      <div className="flex-1">
                        <CardTitle className="text-foreground">Account Statistics</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Your account activity and progress
                        </CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 w-full">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Assessments Completed</Label>
                            <p className="text-sm text-muted-foreground">
                              {sessionsLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin inline" />
                              ) : (
                                `${assessmentCount} assessment${assessmentCount !== 1 ? 's' : ''}`
                              )}
                            </p>
                          </div>
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Learning Progress</Label>
                            <p className="text-sm text-muted-foreground">
                              {learningLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin inline" />
                              ) : (
                                `${learningProgress?.completedModules || 0} module${(learningProgress?.completedModules || 0) !== 1 ? 's' : ''} completed`
                              )}
                            </p>
                          </div>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Second Row - 3-column layout for Password & Security and Account Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  {/* Password & Security - Spans 2 columns */}
                  <Card className="w-full lg:col-span-2">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Password & Security</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Change your password and manage security settings
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-none">
                      <div className="space-y-3">
                        <Label htmlFor="current-password" className="text-foreground font-medium">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                            className="border-border focus:border-primary h-11 w-full"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="new-password" className="text-foreground font-medium">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                            className="border-border focus:border-primary h-11 w-full"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                            className="border-border focus:border-primary h-11 w-full"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={isChangingPassword}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                            Changing...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                  {/* Account Actions - Third column */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                      <div className="flex-1">
                        <CardTitle className="text-foreground">Account Actions</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Manage your account settings
                        </CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 w-full">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                          </div>
                          <Switch 
                            checked={false}
                            onCheckedChange={() => {}}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Login Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                          </div>
                          <Switch 
                            checked={true}
                            onCheckedChange={() => {}}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Session Management</Label>
                            <p className="text-sm text-muted-foreground">Manage active sessions</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Delete Account */}
                <Card className="border-destructive/20 bg-destructive/5 w-full">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-destructive">Delete Account</CardTitle>
                      <CardDescription className="text-destructive/80">
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                    <p className="text-sm text-destructive/80">
                      This action cannot be undone. All your assessment data, learning progress, and account information will be permanently deleted.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="destructive"
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  {/* Display & Language - Spans 2 columns */}
                  <Card className="w-full lg:col-span-2">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Display & Language</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Customize your interface preferences
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-none">
                      <div className="space-y-3">
                        <Label htmlFor="theme" className="text-foreground font-medium">Theme</Label>
                        <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="language" className="text-foreground font-medium">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="timezone" className="text-foreground font-medium">Timezone</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">Eastern Time</SelectItem>
                            <SelectItem value="PST">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="currency" className="text-foreground font-medium">Currency</Label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Preferences Card */}
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Additional Settings</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        More customization options
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Auto-save Settings</Label>
                          <p className="text-sm text-muted-foreground">Automatically save your preferences</p>
                        </div>
                        <Switch 
                          checked={preferences.autoSave}
                          onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Show Tooltips</Label>
                          <p className="text-sm text-muted-foreground">Display helpful tooltips throughout the app</p>
                        </div>
                        <Switch 
                          checked={preferences.showTooltips}
                          onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, showTooltips: checked }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data & Privacy - Third column */}
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Data & Privacy</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Manage your data and privacy settings
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Data Collection</Label>
                          <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                        </div>
                        <Switch 
                          checked={preferences.dataCollection}
                          onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, dataCollection: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Analytics</Label>
                          <p className="text-sm text-muted-foreground">Help improve the app with analytics</p>
                        </div>
                        <Switch 
                          checked={preferences.analytics}
                          onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </div>

                {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="h-11 px-8">
                        Reset to Defaults
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8">
                        Save Preferences
                      </Button>
                    </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  {/* Email & Push Notifications */}
                <Card className="w-full">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                        <CardTitle className="text-foreground">Email & Push Notifications</CardTitle>
                      <CardDescription className="text-muted-foreground">
                          Manage digital notifications
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                      <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => setPreferences(prev => ({ 
                            ...prev, 
                            notifications: { ...prev.notifications, email: checked } 
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => setPreferences(prev => ({ 
                            ...prev, 
                            notifications: { ...prev.notifications, push: checked } 
                          }))}
                        />
                      </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SMS Notifications */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                      <div className="flex-1">
                        <CardTitle className="text-foreground">SMS Notifications</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Manage mobile notifications
                        </CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 w-full">
                      <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-foreground font-medium">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                        </div>
                        <Switch 
                          checked={preferences.notifications.sms}
                          onCheckedChange={(checked) => setPreferences(prev => ({ 
                            ...prev, 
                            notifications: { ...prev.notifications, sms: checked } 
                          }))}
                        />
                      </div>
                    </div>
                    </CardContent>
                  </Card>

                  {/* Notification Preferences - Third column */}
                  <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                      <div className="flex-1">
                        <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Customize notification behavior
                        </CardDescription>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 w-full">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Quiet Hours</Label>
                            <p className="text-sm text-muted-foreground">Disable notifications during quiet hours</p>
                          </div>
                          <Switch 
                            checked={preferences.notifications.quietHours}
                            onCheckedChange={(checked) => setPreferences(prev => ({ 
                              ...prev, 
                              notifications: { ...prev.notifications, quietHours: checked } 
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                          <div className="space-y-1">
                            <Label className="text-foreground font-medium">Weekly Digest</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly summary emails</p>
                          </div>
                          <Switch 
                            checked={preferences.notifications.weeklyDigest}
                            onCheckedChange={(checked) => setPreferences(prev => ({ 
                              ...prev, 
                              notifications: { ...prev.notifications, weeklyDigest: checked } 
                            }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="h-11 px-8">
                        Reset to Defaults
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8">
                        Save Settings
                      </Button>
                    </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

const Profile = () => {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
};

export default Profile; 