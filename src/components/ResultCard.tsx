import { useRef, useState } from 'react';
import type { LabResultResponse, RiskLevel } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

interface ResultCardProps {
    result: LabResultResponse;
}

const getRiskConfig = (risk: RiskLevel, t: any) => {
    // Use backend risk level to determine status, but display translated label if available
    // The backend returns: "NORMAL", "LEICHT ERHÖHT", "KRITISCH"

    switch (risk) {
        case 'NORMAL':
            return { color: 'green', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '✅', label: t('risks.NORMAL') };
        case 'LEICHT ERHÖHT':
            return { color: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: '⚠️', label: t('risks.LEICHT ERHÖHT') };
        case 'KRITISCH':
            return { color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '🚨', label: t('risks.KRITISCH') };
        default:
            return { color: 'slate', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: 'ℹ️', label: risk };
    }
};

const ResultCard = ({ result }: ResultCardProps) => {
    const { t, i18n } = useTranslation();
    const { parameter, explanation, riskLevel, recommendation, timestamp } = result;

    const config = getRiskConfig(riskLevel, t);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Laborbefund_${parameter}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF Export failed', error);
            alert('Fehler beim PDF Export.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-4 animate-fade-in-up">
            {/* Helper Actions */}
            <div className="flex justify-end">
                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
                >
                    {isExporting ? (
                        <span className="animate-pulse">{t('result.creatingPdf')}</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t('result.exportPdf')}
                        </>
                    )}
                </button>
            </div>

            {/* Printable Card Area */}
            <div ref={cardRef} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('result.title')}</h3>
                        <h1 className="text-4xl font-extrabold text-slate-900">{parameter}</h1>
                        <div className="mt-2 text-sm text-slate-400 flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {timestamp ? new Date(timestamp).toLocaleString(i18n.language, { dateStyle: 'long', timeStyle: 'short' }) : new Date().toLocaleDateString()}
                        </div>
                    </div>

                    <div className={`px-6 py-3 rounded-xl border-2 flex items-center gap-3 ${config.bg} ${config.border} ${config.text}`}>
                        <span className="text-2xl">{config.icon}</span>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase opacity-70">{t('result.riskLabel')}</span>
                            <span className="text-lg font-bold">{config.label}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Risikoeinschätzung Detail (Visual Bar) */}
                    <section>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t('result.riskScale')}</h4>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
                            {/* Scale Markers */}
                            <div className={`w-1/3 h-full bg-green-200 ${riskLevel === 'NORMAL' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] z-10' : 'opacity-40'}`}></div>
                            <div className={`w-1/3 h-full bg-yellow-200 ${riskLevel === 'LEICHT ERHÖHT' ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] z-10' : 'opacity-40'}`}></div>
                            <div className={`w-1/3 h-full bg-red-200 ${riskLevel === 'KRITISCH' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] z-10' : 'opacity-40'}`}></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                            <span>{t('result.normal')}</span>
                            <span>{t('result.slightlyElevated')}</span>
                            <span>{t('result.critical')}</span>
                        </div>
                    </section>

                    {/* Explanation */}
                    <section>
                        <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span>🩺</span> {t('result.explanation')}
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-lg bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                            {explanation}
                        </p>
                    </section>

                    {/* Recommendation */}
                    <section>
                        <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span>💡</span> {t('result.recommendation')}
                        </h4>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                            <p className="text-blue-900 font-medium leading-relaxed">
                                {recommendation}
                            </p>
                        </div>
                    </section>
                </div>

                {/* Disclaimer Footer */}
                <div className="mt-12 pt-6 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                        {t('result.disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
