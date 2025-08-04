
import React, { useState, useEffect } from 'react';
import Card from './Card.tsx';
import { getAIAdvice } from '../services/geminiService.ts';
import type { SalesMetric, PeriodProgress, SalesRep } from '../types.ts';

interface AIAdviceProps {
  title: string;
  icon: React.ReactNode;
  metrics: SalesMetric[];
  periodProgress: PeriodProgress;
  dailyRanking: SalesRep[];
  className?: string;
}

const AIAdvice: React.FC<AIAdviceProps> = ({ title, icon, metrics, periodProgress, dailyRanking, className }) => {
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedAdvice = await getAIAdvice(metrics, periodProgress, dailyRanking);
        setAdvice(fetchedAdvice);
      } catch (e: any) {
        console.error("Failed to fetch AI advice:", e);
        setError(e.message || '不明なエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvice();
  }, [metrics, periodProgress, dailyRanking]); 

  return (
    <Card title={title} icon={icon} className={`row-span-1 ${className || ''}`}>
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[150px]">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-400">AIがアドバイスを生成中...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[150px] p-4 text-center">
            <div className="text-red-400 bg-red-900/30 p-4 rounded-lg">
                <p className="font-bold text-lg">AIアドバイスの取得に失敗</p>
                <p className="text-sm mt-2 font-mono bg-slate-900 p-2 rounded">{error}</p>
                <p className="text-xs mt-4 text-slate-400">APIキーが正しく設定されているか確認してください。</p>
            </div>
        </div>
      ) : (
        <ul className="space-y-4">
          {advice.map((item, index) => (
            <li key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              <span className="text-cyan-400 mt-1">&#9679;</span>
              <p className="text-slate-300">{item}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

// Add fade-in animation to tailwind config or a style tag if not present
// For this single-file setup, adding it via style is okay, but usually it would be in a CSS file.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
}
`;
document.head.appendChild(style);


export default AIAdvice;