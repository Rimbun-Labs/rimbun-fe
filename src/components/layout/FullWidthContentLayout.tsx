import React from 'react';
import BaseLayout from './BaseLayout';

/**
 * Same as ContentLayout (padding, sidebar, header) but content area is full width
 * (no max-w-7xl cap). Use for pages that need full-width content (e.g. Banking Products).
 */
const FullWidthContentLayout: React.FC = () => {
  return (
    <BaseLayout
      useContainer={true}
      containMaxWidth={false}
    />
  );
};

export default FullWidthContentLayout;
