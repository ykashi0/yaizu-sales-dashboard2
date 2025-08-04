
import React, { useState, useEffect } from 'react';
import Card from './Card.tsx';
import type { SalesMetric } from '../types.ts';

interface IndividualMetricsProps {
  title: string;
  icon: React.ReactNode;
  data: SalesMetric[];
  className?: string;
}

interface ProgressBarProps {
  metric: SalesMetric;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ metric }) => {
  const { label, current, target, unit } = metric;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Ensure we don't divide by zero and cap progress at 100% for the visual bar.
    const percentage = target > 0 ? (current / target) * 100 : 0;
    const timer = setTimeout(() => setWidth(percentage > 100 ? 100 : percentage), 100);
    return () => clearTimeout(timer);
  }, [current, target]);

  // Bar is orange if the target is met or exceeded, otherwise it's cyan.
  const isTargetMet = target > 0 && current >= target;
  const barColorClass = isTargetMet
    ? 'bg-orange-500'
    : 'bg-cyan-400';

  const isPaytokuRate = label === 'ペイトク加入率';

  const formatValue = (value: number) => {
    if (isPaytokuRate) {
      return `${Math.round(value * 100)}%`;
    }
    return `${value.toLocaleString()}${unit || ''}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm font-medium">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">
          {formatValue(current)} / <span className="text-slate-500">{formatValue(target)}</span>
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className={`${barColorClass} h-2.5 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

const IndividualMetrics: React.FC<IndividualMetricsProps> = ({ title, icon, data, className }) => {
  return (
    <Card title={title} icon={icon} className={className}>
      <div className="h-full overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-6">
            {data.map((metric, index) => (
              <ProgressBar key={index} metric={metric} />
            ))}
          </div>
      </div>
    </Card>
  );
};

export default IndividualMetrics;