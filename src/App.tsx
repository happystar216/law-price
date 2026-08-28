import { useState, useMemo } from 'react';
import type { CaseInputState } from './types';
import { runFullCaseAnalysis } from './utils/decisionEngine';
import { Header } from './components/Header';
import { UserFriendlyConfigurator } from './components/UserFriendlyConfigurator';
import { FiveMetricsBottomBar, type MetricType } from './components/FiveMetricsBottomBar';
import { MetricDetailModal } from './components/MetricDetailModal';
import { LawyerQuoteCard } from './components/LawyerQuoteCard';
import { ReportModal } from './components/ReportModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export function App() {
  const [activeMode, setActiveMode] = useState<'client' | 'lawyer'>('client');
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricType | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [caseInput, setCaseInput] = useState<CaseInputState>({
    category: 'debt',
    isPropertyCase: true,
    claimAmount: 100000,
    regionId: 'national',
    stage: 'first_instance_summary',
    feeMode: 'standard',
    evidenceLevel: 'strong',
    solvencyLevel: 'high',
    hasContractFeeClause: false,
    clientMonthlySalary: 10000,
  });

  const handleInputChange = (updates: Partial<CaseInputState>) => {
    setCaseInput((prev) => ({ ...prev, ...updates }));
  };

  const analysis = useMemo(() => {
    return runFullCaseAnalysis(caseInput);
  }, [caseInput]);

  const scrollToFaq = () => {
    const el = document.getElementById('faq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col selection:bg-blue-500 selection:text-white pb-36 sm:pb-32">
      {/* Top Header */}
      <Header
        currentRegionId={caseInput.regionId}
        onRegionChange={(id) => handleInputChange({ regionId: id })}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onOpenReport={() => setShowReportModal(true)}
        onScrollToFaq={scrollToFaq}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* Intro Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>零法律黑话 · 通俗维权决策演算器</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-indigo-200 bg-white/10 px-2.5 py-1 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>实时演算中</span>
            </div>
          </div>

          <h1 className="text-base sm:text-xl font-bold tracking-tight">
            根据您自己的实际情况选一选 · 底部实时查看 5 大决策结果
          </h1>
          <p className="text-xs text-slate-300">
            涵盖金钱花费、自身耗时、等待周期、胜诉概率及律师工作量清单（底部任意一项皆可点开看明细）
          </p>
        </div>

        {/* Lawyer Quote Tool (if in Lawyer Mode) */}
        {activeMode === 'lawyer' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <LawyerQuoteCard analysis={analysis} />
          </div>
        )}

        {/* 100% User-Friendly Configurator */}
        <UserFriendlyConfigurator input={caseInput} onChange={handleInputChange} />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* 5 Metrics Bottom Dock (Always Fixed at Bottom, Clickable) */}
      <FiveMetricsBottomBar
        analysis={analysis}
        onOpenMetric={(metric) => setActiveMetricDetail(metric)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* 5-Tab Detail Modal */}
      {activeMetricDetail && (
        <MetricDetailModal
          initialMetric={activeMetricDetail}
          analysis={analysis}
          onClose={() => setActiveMetricDetail(null)}
          onOpenReport={() => {
            setActiveMetricDetail(null);
            setShowReportModal(true);
          }}
        />
      )}

      {/* Print / Export Report Modal */}
      {showReportModal && (
        <ReportModal analysis={analysis} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

export default App;
