import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalysisHistory } from '../types';

interface HistoryChartProps {
    history: AnalysisHistory[];
    currentParameter: string;
}

const HistoryChart = ({ history, currentParameter }: HistoryChartProps) => {
    const { t } = useTranslation();

    // Filter history for current parameter and sort by date ascending
    const data = history
        .filter(h => h.request.parameter === currentParameter)
        .map(h => ({
            date: new Date(h.date).toLocaleDateString(),
            value: h.request.value,
            riskLevel: h.response.riskLevel,
            unit: h.request.unit,
            fullDate: h.date
        }))
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center h-[350px] flex flex-col items-center justify-center text-slate-400">
                <div className="mb-4 text-4xl opacity-20">📊</div>
                <p>{t('history.noData')}</p>
            </div>
        );
    }

    // Determine chart colors based on latest risk
    const getStrokeColor = (level: string) => {
        switch (level) {
            case 'LEICHT ERHÖHT': return '#eab308';
            case 'KRITISCH': return '#ef4444';
            default: return '#22c55e';
        }
    };

    const latestRisk = data[data.length - 1]?.riskLevel || 'NORMAL';
    const chartColor = getStrokeColor(latestRisk);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-fade-in-up">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📈</span> {t('history.chartTitle', { parameter: currentParameter })}
            </h3>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            axisLine={{ stroke: '#e2e8f0' }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                        />
                        {/* Using a reference line for visual baseline if we had normal range data, omitted for dynamic params */}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HistoryChart;
