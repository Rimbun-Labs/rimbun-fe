
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileProvider } from '@/contexts/ProfileContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import FinancialProfileCard from '@/components/profile/FinancialProfileCard';
import NotificationSettings from '@/components/profile/NotificationSettings';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import PreferencesCard from '@/components/profile/PreferencesCard';
import LearningProgressSummary from '@/components/profile/LearningProgressSummary';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract tab from URL or default to 'overview'
  const hashTab = location.hash.replace('#', '');
  const [activeTab, setActiveTab] = React.useState<string>(
    ['overview', 'settings', 'learning', 'financial'].includes(hashTab) 
      ? hashTab 
      : 'overview'
  );
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile#${value}`, { replace: true });
  };
  
  return (
    <ProfileProvider>
      <div className="container max-w-5xl mx-auto py-6 px-4 space-y-6">
        <ProfileHeader />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial Profile</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialProfileCard />
              <LearningProgressSummary />
            </div>
            <ProfileAchievements />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-6">
            <FinancialProfileCard />
          </TabsContent>
          
          <TabsContent value="learning" className="space-y-6">
            <LearningProgressSummary />
            <ProfileAchievements />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PreferencesCard />
              <NotificationSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProfileProvider>
  );
};

export default Profile;
