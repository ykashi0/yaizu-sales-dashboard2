
import type { DashboardData } from '../types.ts';

// The Google Apps Script endpoint URL for fetching live dashboard data.
const DATA_URL = 'https://script.google.com/macros/s/AKfycbzhQtj_DWZ6y4Pp3qc05K67ryxG_TacR1V7AMOQkS13qYlytfAoR-ByOEXfjYiIVcuV/exec';

const getMockData = (): DashboardData => {
    // This mock data is used as a fallback if fetching from the live URL fails.
    console.warn("Using mock data due to an error fetching live data. Check the console for details.");
    return {
        periodProgress: { current: 3700, target: 6500, unit: "P" },
        dailyTarget: { target: 800, unit: "P" },
        individualMetrics: [
            { label: "ペイトク加入率", current: 0.45, target: 0.60, unit: "%" },
            { label: "S対外", current: 18, target: 40, unit: "" },
            { label: "Y対外", current: 12, target: 30, unit: "" },
            { label: "MNP (ALL)", current: 30, target: 70, unit: "" },
            { label: "機種変", current: 65, target: 60, unit: "" },
            { label: "固定 (光・Air)", current: 7, target: 15, unit: "" },
            { label: "タブレット", current: 11, target: 25, unit: "" },
            { label: "でんき", current: 6, target: 12, unit: "" },
            { label: "PayPayカード", current: 22, target: 45, unit: "" },
            { label: "Apple Watch", current: 9, target: 20, unit: "" },
            { label: "Pixel Watch", current: 5, target: 10, unit: "" },
            { label: "アップグレード", current: 28, target: 50, unit: "" },
            { label: "セレクション売上", current: 1250000, target: 2400000, unit: "円" },
        ],
        monthlySalesRanking: [
            { rank: 1, name: "佐藤", points: 1250 },
            { rank: 2, name: "鈴木", points: 980 },
            { rank: 3, name: "高橋", points: 760 },
        ],
        dailySalesRanking: [
            { rank: 1, name: "佐藤", points: 310, awardCount: 3 },
            { rank: 2, name: "高橋", points: 250, awardCount: 5 },
            { rank: 3, name: "田中", points: 220, awardCount: 1 },
        ]
    };
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
    try {
        // Attempt to fetch live data from the Google Apps Script endpoint.
        const response = await fetch(DATA_URL, { redirect: 'follow' });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with an error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const text = await response.text();
        const data = JSON.parse(text);

        // Basic validation to ensure the response contains expected data structures.
        if (!data.periodProgress || !data.individualMetrics || !data.monthlySalesRanking) {
             throw new Error("Fetched data is not in the expected format.");
        }

        return data;

    } catch (error) {
        // If fetching or parsing fails for any reason (e.g., CORS, network error, invalid JSON),
        // log the error and return mock data so the app remains functional.
        console.error("Failed to fetch or parse live data. Falling back to mock data.", error);
        return getMockData();
    }
};