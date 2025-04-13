import React from 'react';

interface MixerSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

const MixerSection: React.FC<MixerSectionProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-surface rounded-lg p-5 mb-6 shadow-lg ${className}`}>
      <div className="flex items-center mb-5 border-b border-accent/20 pb-3">
        {icon && (
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3 text-accent">
            <span>{icon}</span>
          </div>
        )}
        <h2 className="text-xl font-title text-white text-shadow-sm">{title}</h2>
      </div>
      <div className="font-body">
        {children}
      </div>
    </div>
  );
};

export default MixerSection;
