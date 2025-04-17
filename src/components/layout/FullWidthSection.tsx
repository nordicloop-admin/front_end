import React from 'react';

interface FullWidthSectionProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const FullWidthSection: React.FC<FullWidthSectionProps> = ({ children, backgroundColor }) => {
  return (
    <div 
      className="relative w-full" 
      style={{ 
        backgroundColor,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        width: '100vw',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

export default FullWidthSection;
