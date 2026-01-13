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
  BookOpen,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/lib/api/userService';
import { config } from '@/lib/api/config';
import { auth } from '@/lib/firebase/config';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionTier } from '@/lib/api/types/subscription';
import { updateSubscription } from '@/lib/api/subscriptionApi';
import { authService } from '@/lib/auth/authService';

const ProfileContent = () => {
  const { profile, isLoading, error, updateProfileData } = useProfile();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Assessment count now comes from profile.summary (no need for separate API call)
  const assessmentCount = profile?.summary?.totalAssessments || 0;
  
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
    if (!user) {
      toast.error('Please log in to change your password');
      return;
    }

    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Step 1: Re-authenticate user with current password
      const reauthResult = await authService.reauthenticateUser(user, passwordData.currentPassword);
      if (reauthResult.error) {
        toast.error(reauthResult.error.message || 'Current password is incorrect');
        return;
      }

      // Step 2: Update password
      const updateResult = await authService.updateUserPassword(user, passwordData.newPassword);
      if (updateResult.error) {
        toast.error(updateResult.error.message || 'Failed to change password');
        return;
      }

      // Success
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('Unable to delete account. Please log in again.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your data including assessments, learning progress, and recommendations will be permanently deleted.'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // Get Firebase JWT token for authentication
      const idToken = await user.getIdToken();

      // Call backend API to delete user and all associated data
      const response = await fetch(`${config.API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      const result = await response.json();
      toast.success(result.data?.message || 'Your account has been deleted successfully');
      
      // Clear local storage
      userService.clearDatabaseUserId();
      
      // Sign out from Firebase
      await signOut();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    if (!user) {
      toast.error('Unable to export data. Please log in again.');
      return;
    }

    setIsExporting(true);
    try {
      // Get Firebase JWT token for authentication
      const idToken = await user.getIdToken();

      const response = await fetch(`${config.API_BASE_URL}/users/me/export`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export data');
      }

      const data = await response.json();
      
      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
      a.download = `my-investlearn-data-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Your data has been exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
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
                Loading your profile...
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
              <TabsList className="grid grid-cols-1 mb-6 w-full">
                <TabsTrigger value="account">Account</TabsTrigger>
                {/* Preferences tab disabled for testbed launch - keeping profile simple */}
                {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
                {/* Notifications tab disabled for testbed launch - no backend connection */}
                {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
                {/* Subscription tab disabled for testbed launch */}
                {/* <TabsTrigger value="subscription">Subscription</TabsTrigger> */}
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
                          placeholder="Enter your email address"
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
                      {/** Phone Number removed (feature not implemented) **/}
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
                      {/** Company removed (feature not implemented) **/}
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
                              {isLoading ? (
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
                            <Label className="text-foreground font-medium">Assessment Progress</Label>
                            <p className="text-sm text-muted-foreground">
                              {isLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin inline" />
                              ) : (
                                `${assessmentCount} assessment${assessmentCount !== 1 ? 's' : ''} completed`
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

                {/* Second Row - Password & Security */}
                <div className="grid grid-cols-1 gap-8 w-full max-w-none">
                  {/* Password & Security */}
                  <Card className="w-full">
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

                  {/* Account Actions - Disabled for testbed launch - keeping profile simple */}
                  {/* <Card className="w-full">
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
                        Two-Factor Authentication removed (not functional)
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
                  </Card> */}
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
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Data - Disabled for testbed launch - backend endpoint not available */}
                {/* <Card className="w-full">
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4 pb-4">
                    <div className="flex-1">
                      <CardTitle className="text-foreground">Export My Data</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Download a copy of all your personal data (GDPR/CCPA compliance)
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Download className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full">
                    <p className="text-sm text-muted-foreground">
                      Export all your account data including profile information, assessments, learning progress, and recommendations in JSON format.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export My Data
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}
              </TabsContent>

              {/* Preferences Tab - Disabled for testbed launch - keeping profile simple */}
              {/* <TabsContent value="preferences" className="space-y-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  Display & Language - Spans 2 columns
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

                Additional Preferences Card
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

                Data & Privacy - Third column
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

                Action Buttons
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="h-11 px-8">
                        Reset to Defaults
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8">
                        Save Preferences
                      </Button>
                    </div>
              </TabsContent> */}

              {/* Notifications Tab - Disabled for testbed launch */}
              {/* <TabsContent value="notifications" className="space-y-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-none">
                  Email & Push Notifications
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

                  SMS Notifications
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

                  Notification Preferences - Third column
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

                Action Buttons
                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="h-11 px-8">
                        Reset to Defaults
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-11 px-8">
                        Save Settings
                      </Button>
                    </div>
              </TabsContent> */}

              {/* Subscription Tab - Disabled for testbed launch */}
              {/* <TabsContent value="subscription" className="space-y-8 w-full">
                <SubscriptionTab />
              </TabsContent> */}
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

// Subscription Tab Component
const SubscriptionTab: React.FC = () => {
  const { subscription, isLoading, isPremium, isBusiness, refetch } = useSubscription();
  const [updatingTier, setUpdatingTier] = useState<SubscriptionTier | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Unable to load subscription data</p>
        </CardContent>
      </Card>
    );
  }

  const getTierDisplayName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.BUSINESS:
        return 'Business';
      case SubscriptionTier.PREMIUM:
        return 'Premium';
      default:
        return 'Free';
    }
  };

  const getTierBadgeClass = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.BUSINESS:
        return 'bg-purple-500 text-white';
      case SubscriptionTier.PREMIUM:
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const featureComparison = {
    'Recommendations': { free: true, premium: true, business: true },
    'AI Chat': { free: false, premium: true, business: true },
    'Unlimited Requests': { free: false, premium: false, business: true },
    'Dedicated Manager': { free: false, premium: false, business: true },
  };

  // Handle plan selection
  const handleSelectPlan = async (tier: SubscriptionTier) => {
    // Don't do anything if selecting current plan
    if (subscription?.tier === tier) {
      return;
    }

    setUpdatingTier(tier);
    try {
      await updateSubscription({
        tier,
        billingPeriod: 'monthly', // Default to monthly
      });
      
      // Refresh subscription data
      await refetch();
      
      toast.success(`Successfully switched to ${getTierDisplayName(tier)} plan`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update subscription';
      toast.error(errorMessage);
    } finally {
      setUpdatingTier(null);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge className={`${getTierBadgeClass(subscription.tier)} text-lg px-4 py-2`}>
              {getTierDisplayName(subscription.tier)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="flex items-center gap-2 mt-1">
                {subscription.isActive ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>
            {subscription.expiresAt && (
              <div>
                <Label className="text-muted-foreground">Expires</Label>
                <div className="mt-1 font-medium">
                  {new Date(subscription.expiresAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 font-semibold">Premium</th>
                  <th className="text-center py-3 px-4 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureComparison).map(([feature, tiers]) => (
                  <tr key={feature} className="border-b">
                    <td className="py-3 px-4">{feature}</td>
                    <td className="text-center py-3 px-4">
                      {tiers.free ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {tiers.premium ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {tiers.business ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {subscription.tier !== SubscriptionTier.BUSINESS && (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>Choose the plan that's right for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Free Plan Card */}
              <Card className={`${subscription.tier === SubscriptionTier.FREE ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="text-3xl font-bold">$0/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Basic Questions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Portfolio View</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Limited AI Requests</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={subscription.tier === SubscriptionTier.FREE ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(SubscriptionTier.FREE)}
                    disabled={subscription.tier === SubscriptionTier.FREE || updatingTier !== null}
                  >
                    {updatingTier === SubscriptionTier.FREE ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : subscription.tier === SubscriptionTier.FREE ? (
                      'Current Plan'
                    ) : (
                      'Select Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan Card */}
              <Card className={`${subscription.tier === SubscriptionTier.PREMIUM ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <div className="text-3xl font-bold">$6.99/mo</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Everything in Free</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AI Chat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">More AI Requests</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={subscription.tier === SubscriptionTier.PREMIUM ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(SubscriptionTier.PREMIUM)}
                    disabled={subscription.tier === SubscriptionTier.PREMIUM || updatingTier !== null}
                  >
                    {updatingTier === SubscriptionTier.PREMIUM ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : subscription.tier === SubscriptionTier.PREMIUM ? (
                      'Current Plan'
                    ) : (
                      'Select Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Business Plan Card */}
              <Card className={`${subscription.tier === SubscriptionTier.BUSINESS ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>Business</CardTitle>
                  <div className="text-3xl font-bold">Custom</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Everything in Premium</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unlimited Requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Dedicated Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom Integrations</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={subscription.tier === SubscriptionTier.BUSINESS ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(SubscriptionTier.BUSINESS)}
                    disabled={subscription.tier === SubscriptionTier.BUSINESS || updatingTier !== null}
                  >
                    {updatingTier === SubscriptionTier.BUSINESS ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : subscription.tier === SubscriptionTier.BUSINESS ? (
                      'Current Plan'
                    ) : (
                      'Select Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
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