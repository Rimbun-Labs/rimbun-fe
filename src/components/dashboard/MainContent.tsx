
import React from 'react';
import RiskProfileSection from './RiskProfileSection';
import PortfolioSection from './PortfolioSection';

interface MainContentProps {
  profile: any;
  portfolioData: any;
  recommendationsData: any;
  profileLoading: boolean;
  portfolioLoading: boolean;
  recommendationsLoading: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  profile,
  portfolioData,
  recommendationsData,
  profileLoading,
  portfolioLoading,
  recommendationsLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <RiskProfileSection 
        profile={profile} 
        profileLoading={profileLoading} 
      />
      
      <PortfolioSection 
        portfolioData={portfolioData}
        recommendationsData={recommendationsData}
        portfolioLoading={portfolioLoading}
        recommendationsLoading={recommendationsLoading}
      />
    </div>
  );
};

export default MainContent;
