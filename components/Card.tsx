
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-white/10 flex flex-col ${className}`}>
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/50 shrink-0">
        <div className="text-cyan-400">{icon}</div>
        <h2 className="text-lg font-bold text-slate-200">{title}</h2>
      </div>
      <div className="p-4 md:p-6 flex-grow overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Card;
