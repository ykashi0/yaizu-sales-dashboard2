
import React, { useState, useEffect } from 'react';
import Card from './Card.tsx';
import { ScoreIndicatorIcon } from '../constants.tsx';
import type { SalesRep } from '../types.ts';

interface SalesRankingProps {
  title: string;
  icon: React.ReactNode;
  data: SalesRep[];
}

const rankColors: { [key: number]: string } = {
  1: 'text-amber-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

const SalesRanking: React.FC<SalesRankingProps> = ({ title, icon, data }) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    setVisibleItems([]); // Reset for new data
    const timers = data.map((_, index) => 
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [data]);

  return (
    <Card title={title} icon={icon}>
      <ul className="space-y-4">
        {data.map((rep, index) => {
          // Rank 1 gets gold, others get cyan for their score, matching the screenshot
          const scoreColorClass = rep.rank === 1 ? rankColors[1] : 'text-cyan-400';
          return (
            <li
              key={rep.rank}
              className={`flex items-center justify-between p-3 bg-slate-800 rounded-lg transition-all duration-500 ease-out ${visibleItems.includes(index) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black w-8 text-center ${rankColors[rep.rank] || 'text-slate-400'}`}>
                  {rep.rank}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-lg">{rep.name}</span>
                  {rep.awardCount !== undefined && (
                    <span className="text-sm text-slate-400 font-medium">({rep.awardCount}回)</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ScoreIndicatorIcon className={scoreColorClass} />
                <span className={`text-xl font-bold ${scoreColorClass}`}>
                  {rep.points.toLocaleString()} <span className="text-sm">P</span>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  );
};

export default SalesRanking;