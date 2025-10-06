import React from 'react';
import BaseLayout from './BaseLayout';

const AppLayout: React.FC = () => {
  return (
    <BaseLayout 
      useContainer={false}
      layoutName="🔧 Using AppLayout (Full Width)"
      debugColor="bg-blue-100 text-blue-800 border-blue-300"
    />
  );
};

export default AppLayout;
