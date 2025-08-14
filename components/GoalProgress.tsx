import React, { useState, useEffect } from 'react';
import Card from './Card.tsx';
import type { PeriodProgress, DailyTarget } from '../types.ts';

interface GoalProgressProps {
  title: string;
  icon: React.ReactNode;
  dailyTarget: DailyTarget;
  periodProgress: PeriodProgress;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ title, icon, dailyTarget, periodProgress }) => {
  const { current, target, unit, official } = periodProgress;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [current, target]);

  const remaining = target - current > 0 ? target - current : 0;

  return (
    <Card title={title} icon={icon}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* Left Side: Daily Target */}
        <div className="md:col-span-2 text-center flex flex-col justify-center h-full">
          <p className="text-slate-400 text-base mb-1">本日の目標</p>
          <p className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
            {dailyTarget.target.toLocaleString()}
            <span className="text-3xl lg:text-4xl text-slate-400 ml-2">{dailyTarget.unit}</span>
          </p>
        </div>

        {/* Right Side: Period Progress */}
        <div className="w-full space-y-2 md:col-span-3">
          <div className="text-center">
            <p className="text-slate-400 text-sm">現在 <span className="text-2xl font-bold text-white ml-1">{Math.round(progress)}<span className="text-lg text-slate-400">%</span></span></p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
             <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-medium text-slate-300 px-1 flex-wrap gap-x-4">
            <span>
              進捗: <span className="font-bold text-white">{current.toLocaleString()}</span> {unit}
              {official !== undefined && (
                <span className="text-slate-400 ml-2">(確定実績: <span className="font-bold text-white">{official.toLocaleString()}</span> {unit})</span>
              )}
            </span>
            <span>残り: <span className="font-bold text-white">{remaining.toLocaleString()}</span> {unit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoalProgress;
