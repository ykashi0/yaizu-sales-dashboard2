import { GoogleGenAI, Type } from "@google/genai";
import type { PeriodProgress, SalesMetric, SalesRep } from '../types.ts';

// The API key must be provided via the `process.env.API_KEY` environment variable.
// The application must not prompt the user for it.
if (!process.env.API_KEY) {
    // The error will be caught by the component and displayed to the user.
    throw new Error("APIキーが設定されていません。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatValue = (value: number, unit?: string) => {
    if (unit === "%") {
        // Handle percentage values which are stored as decimals (e.g., 0.45 -> 45%)
        return `${Math.round(value * 100)}%`;
    }
    return `${value.toLocaleString()}${unit || ''}`;
};


const createPrompt = (metrics: SalesMetric[], periodProgress: PeriodProgress, dailyRanking: SalesRep[]): string => {
    const metricsSummary = metrics.map(m => {
        const targetMet = m.target > 0 && m.current >= m.target;
        const progress = m.target > 0 ? Math.round((m.current / m.target) * 100) : 0;
        return `- ${m.label}: ${formatValue(m.current, m.unit)} / ${formatValue(m.target, m.unit)} (進捗 ${progress}%) ${targetMet ? '【目標達成】' : ''}`;
    }).join('\n');

    const officialProgressText = periodProgress.official !== undefined
        ? ` (内、確定実績: ${formatValue(periodProgress.official, periodProgress.unit)})`
        : '';
    const periodProgressSummary = `期間進捗: ${formatValue(periodProgress.current, periodProgress.unit)}${officialProgressText} / ${formatValue(periodProgress.target, periodProgress.unit)} (進捗 ${Math.round((periodProgress.current/periodProgress.target)*100)}%)`;
    
    const dailyRankingSummary = dailyRanking.map(r => `- ${r.rank}位: ${r.name}さん (${formatValue(r.points, 'P')})`).join('\n');

    return `
あなたはソフトバンクショップの優秀な店舗マネージャーです。
以下のチームの実績データに基づき、クルー（販売員）のモチベーションを高め、具体的なアクションにつながるポジティブで的確なアドバイスを3つ、日本語で生成してください。

## 現在の実績データ

### ${periodProgressSummary}

### 個別数値の詳細
${metricsSummary}

### 本日のデイリーランキング
${dailyRankingSummary}

## アドバイス生成のルール
- 3つの簡潔な箇条書きリストで出力してください。
- 各アドバイスは100文字以内で、具体的で実行可能な内容にしてください。
- 達成できている指標を褒めつつ、未達成の指標を改善するためのポジティブな提案をしてください。
- チーム全体が「よし、今日も頑張ろう！」と思えるような、前向きで力強い言葉を選んでください。
`;
};


export const getAIAdvice = async (metrics: SalesMetric[], periodProgress: PeriodProgress, dailyRanking: SalesRep[]): Promise<string[]> => {
    
    const prompt = createPrompt(metrics, periodProgress, dailyRanking);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        advice: {
                            type: Type.ARRAY,
                            description: "モチベーションを高めるための3つの具体的なアドバイスのリスト。",
                            items: {
                                type: Type.STRING,
                                description: "100文字以内のポジティブなアドバイス"
                            }
                        }
                    },
                    required: ["advice"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.advice) && result.advice.length > 0) {
            return result.advice;
        } else {
            console.error("AI response did not match expected format or was empty:", result);
            throw new Error("AIから予期しない形式の応答がありました。");
        }
    } catch (error) {
        console.error("AIアドバイスの取得中にエラーが発生しました:", error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                 throw new Error("Gemini APIキーが設定されていません。");
            }
            // Handle quota exceeded error specifically
            if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
                throw new Error("APIの利用上限に達しました。しばらく時間をおいて再度お試しください。");
            }
            // For other errors, provide a generic message without exposing raw error details to the UI
            throw new Error("AIからの応答がありませんでした。ネットワーク接続を確認するか、時間をおいて再度お試しください。");
        }
        throw new Error("AIアドバイスの生成中に不明なエラーが発生しました。");
    }
};
