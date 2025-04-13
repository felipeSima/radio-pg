import React from 'react';

interface MixerSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const MixerSection: React.FC<MixerSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-secondary rounded-lg p-4 mb-6 shadow-lg ${className}`}>
      <h2 className="text-xl font-medieval border-b border-accent pb-2 mb-4 text-accent">{title}</h2>
      {children}
    </div>
  );
};

export default MixerSection;
