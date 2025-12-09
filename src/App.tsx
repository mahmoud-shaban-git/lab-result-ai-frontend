import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LabForm from './components/LabForm';
import ResultCard from './components/ResultCard';
import Skeleton from './components/Skeleton';
import HistoryChart from './components/HistoryChart';
import type { LabResultRequest, LabResultResponse, AnalysisHistory } from './types';
import { explainLabResult, ApiError } from './api/labResults';

const HISTORY_KEY = 'lab_ai_history';

function App() {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState<LabResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [lastRequest, setLastRequest] = useState<LabResultRequest | null>(null);
  const [currentParameter, setCurrentParameter] = useState<string>('Glucose');

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (req: LabResultRequest, res: LabResultResponse) => {
    const newEntry: AnalysisHistory = {
      id: crypto.randomUUID(),
      request: req,
      response: res,
      date: new Date().toISOString()
    };

    const newHistory = [newEntry, ...history].slice(0, 50); // Increased limit as we have chart now
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleExplain = async (data: LabResultRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastRequest(data);
    setCurrentParameter(data.parameter);

    try {
      const response = await explainLabResult(data);
      setResult(response);
      saveToHistory(data, response);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('error.generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleExplain(lastRequest);
    }
  };

  const loadFromHistory = (entry: AnalysisHistory) => {
    setResult(entry.response);
    setLastRequest(entry.request);
    setCurrentParameter(entry.request.parameter);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <span className="text-lg font-bold text-slate-900 hidden sm:block">{t('app.title')}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-500 hidden md:block">
              {t('app.connected')}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: Input Form (New Analysis) */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 sticky lg:top-24">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">📝</span>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('app.newAnalysis', 'Neuer Befund')}</h2>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1 overflow-hidden">
              <LabForm onSubmit={handleExplain} isLoading={isLoading} />
            </div>

            {/* Mobile/Tablet Intro (Hidden on Large if result exists to save space?) - actually keeps it helpful */}
            <div className="hidden md:block p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <p className="text-xs text-blue-800/70 leading-relaxed">
                {t('app.description')}
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Analysis Result & Charts */}
          <div className="md:col-span-8 lg:col-span-6 flex flex-col gap-8 min-h-[500px]">

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2 px-1 justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">🔬</span>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('app.analysisResult', 'Analyse-Ergebnis')}</h2>
              </div>
              {result && (
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full animate-fade-in">
                  {t('status.complete', 'Analyse abgeschlossen')}
                </span>
              )}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              {/* 1. Loading State */}
              {isLoading && (
                <div className="w-full">
                  <Skeleton />
                </div>
              )}

              {/* 2. Empty State (Intro) */}
              {!result && !isLoading && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <span className="text-4xl">👋</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">Willkommen beim Lab Result AI</h3>
                  <p className="max-w-md mx-auto leading-relaxed">
                    Bitte geben Sie links Ihre Laborwerte ein, um eine detaillierte KI-Analyse zu erhalten.
                  </p>
                </div>
              )}

              {/* 3. Error State */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-fade-in-up">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">⚠️</div>
                  <h3 className="text-red-900 font-bold text-lg mb-2">{t('error.title')}</h3>
                  <p className="text-red-600 mb-6">{error}</p>
                  <button onClick={handleRetry} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-200">
                    {t('error.retry')}
                  </button>
                </div>
              )}

              {/* 4. Success Result */}
              {result && !isLoading && (
                <div className="animate-fade-in-up duration-500">
                  <ResultCard result={result} />
                </div>
              )}

              {/* 5. Chart Section */}
              {result && !isLoading && history.length > 0 && (
                <div className="animate-fade-in-up duration-700 delay-100">
                  <div className="flex items-center gap-2 mb-4 px-1 mt-8">
                    <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">📈</span>
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('app.trendAnalysis', 'Verlauf & Trend')}</h2>
                  </div>
                  <HistoryChart history={history} currentParameter={currentParameter} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: History / Sidebar */}
          <div className="md:col-span-8 md:col-start-5 lg:col-span-3 lg:col-start-auto flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-2 px-1 justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 p-1.5 rounded-lg">📜</span>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('history.title')}</h2>
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{history.length}</span>
            </div>

            {/* History List Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
              {history.length > 0 ? (
                <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => loadFromHistory(entry)}
                      className={`w-full p-3 text-left rtl:text-right hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 group flex items-start gap-3
                               ${lastRequest === entry.request ? 'bg-blue-50/50 border-blue-100 ring-1 ring-blue-100' : ''}
                            `}
                    >
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm
                               ${entry.response.riskLevel === 'NORMAL' ? 'bg-green-500' :
                          entry.response.riskLevel === 'LEICHT ERHÖHT' ? 'bg-yellow-500' : 'bg-red-500'}
                            `}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-bold text-slate-700 text-sm truncate group-hover:text-blue-700 transition-colors">
                            {entry.request.parameter}
                          </h4>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            {new Date(entry.date).toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-600 font-medium">
                            {entry.request.value}
                          </span>
                          <span className="text-slate-400">{entry.request.unit}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <div className="text-3xl mb-3 opacity-20">📭</div>
                  <p className="text-sm">{t('history.noData')}</p>
                </div>
              )}
            </div>

            {/* Privacy Note (Small) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] text-slate-400 leading-normal text-center">
                {t('app.privacyText')}
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-16 py-8 text-center text-slate-400 text-sm border-t border-slate-200/50">
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  );
}

export default App;
