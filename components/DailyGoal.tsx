
import React, { useState, useEffect } from 'react';
import Card from './Card.tsx';
import type { PeriodProgress as DailyGoal } from '../types.ts';

interface DailyGoalProps {
  title: string;
  icon: React.ReactNode;
  data: DailyGoal;
}

const DailyGoal: React.FC<DailyGoalProps> = ({ title, icon, data }) => {
  const { current, target, unit } = data;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [current, target]);

  return (
    <Card title={title} icon={icon}>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm">S目標まで</p>
          <p className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
            {current.toLocaleString()}
            <span className="text-3xl lg:text-4xl text-slate-400 ml-2">{unit}</span>
          </p>
        </div>

        <div className="w-full space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-400">0 {unit}</span>
            <span className="text-cyan-300">{target.toLocaleString()} {unit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DailyGoal;