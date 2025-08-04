
import React, { useState, useEffect } from 'react';
import GoalProgress from './components/GoalProgress.tsx';
import IndividualMetrics from './components/IndividualMetrics.tsx';
import SalesRanking from './components/SalesRanking.tsx';
import AIAdvice from './components/AIAdvice.tsx';
import { TargetIcon, ChartBarIcon, UsersIcon, SparklesIcon } from './constants.tsx';
import { fetchDashboardData } from './services/dataService.ts';
import type { DashboardData } from './types.ts';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Don't show the full page loader for subsequent background refreshes, only for the initial load.
      if (!data) {
        setLoading(true);
      }
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
        setError(null); // Clear previous errors on a successful fetch
      } catch (err) {
        setError('データの読み込みに失敗しました。');
        console.error(err);
      } finally {
        // Only stop the main loading indicator on the initial load
        if (loading) {
          setLoading(false);
        }
      }
    };
    
    loadData(); // Load data on initial render
    
    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(loadData, 300000); // 300000 ms = 5 minutes
    
    // Clean up the interval when the component is unmounted to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once to set up the interval

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-400 text-lg">データを読み込んでいます...</span>
        </div>
      </div>
    );
  }

  if (error && !data) { // Only show full-screen error if there's no data to display
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">エラー</h2>
          <p className="text-slate-300">{error || 'データを表示できませんでした。'}</p>
        </div>
      </div>
    );
  }
  
  if (!data) return null; // Should not happen if loading and error are handled, but good for safety.

  return (
    <div className="min-h-screen bg-slate-900 p-4 lg:p-8 font-sans">
       {error && ( // Display a non-intrusive error banner if a refresh fails
        <div className="absolute top-4 right-4 bg-red-800/80 text-white p-3 rounded-lg shadow-lg z-50">
          <p>データの自動更新に失敗しました。古いデータが表示されている可能性があります。</p>
        </div>
      )}
      <header className="mb-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          実績ダッシュボード
        </h1>
        <p className="text-slate-400 mt-2">昨日までの実績サマリー</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-5 auto-rows-min gap-6 lg:gap-8">
        
        {/* Top-Left: Goal Progress */}
        <div className="lg:col-span-3">
          <GoalProgress
            title="本日の目標 & 期間進捗"
            icon={<TargetIcon />}
            dailyTarget={data.dailyTarget}
            periodProgress={data.periodProgress}
          />
        </div>
        
        {/* Right Column: Individual Metrics (Spanning all 3 rows on the left) */}
        <div className="lg:col-span-2 lg:row-span-3">
           <IndividualMetrics
            title="個別数値"
            icon={<ChartBarIcon />}
            data={data.individualMetrics}
            className="h-full"
          />
        </div>
        
        {/* Middle-Left: Rankings */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <SalesRanking
            title="月間ランキング"
            icon={<UsersIcon />}
            data={data.monthlySalesRanking}
          />
          <SalesRanking
            title="Dailyランキング"
            icon={<UsersIcon />}
            data={data.dailySalesRanking}
          />
        </div>
        
        {/* Bottom-Left: AI Advice */}
        <div className="lg:col-span-3">
          <AIAdvice
            title="AI アドバイス"
            icon={<SparklesIcon />}
            metrics={data.individualMetrics}
            periodProgress={data.periodProgress}
            dailyRanking={data.dailySalesRanking}
          />
        </div>
      </main>
    </div>
  );
};

export default App;