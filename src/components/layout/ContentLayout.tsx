import React from 'react';
import BaseLayout from './BaseLayout';

const ContentLayout: React.FC = () => {
  return (
    <BaseLayout 
      useContainer={true}
      layoutName="📱 Using ContentLayout (Contained Width)"
      debugColor="bg-green-100 text-green-800 border-green-300"
    />
  );
};

export default ContentLayout; 