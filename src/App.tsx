import { useState, useMemo } from 'react';
import type { CaseInputState } from './types';
import { runFullCaseAnalysis } from './utils/decisionEngine';
import { Header } from './components/Header';
import { CaseConfigurator } from './components/CaseConfigurator';
import { ConfiguratorBottomBar } from './components/ConfiguratorBottomBar';
import { ConfigDetailDrawer } from './components/ConfigDetailDrawer';
import { LawyerQuoteCard } from './components/LawyerQuoteCard';
import { ReportModal } from './components/ReportModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, Coins, UserCheck, Calendar } from 'lucide-react';

export function App() {
  const [activeMode, setActiveMode] = useState<'client' | 'lawyer'>('client');
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
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
    <div className="min-h-screen bg-slate-100/80 flex flex-col selection:bg-blue-500 selection:text-white pb-32 sm:pb-28">
      {/* Top Header */}
      <Header
        currentRegionId={caseInput.regionId}
        onRegionChange={(id) => handleInputChange({ regionId: id })}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onOpenReport={() => setShowReportModal(true)}
        onScrollToFaq={scrollToFaq}
      />

      {/* Main Configurator Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* Intro Header: 三大付出核心定位 */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>诉讼全要素智能选配器</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-indigo-200 bg-white/10 px-2.5 py-1 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>实时演算中</span>
            </div>
          </div>

          <h1 className="text-base sm:text-xl font-bold tracking-tight">
            调整上方案情条件 · 底部实时演算「三大维权付出」
          </h1>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-xs">
            <div className="flex items-center space-x-1.5 text-amber-300">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">① 金钱总支出</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">② 自身精力工时</span>
            </div>
            <div className="flex items-center space-x-1.5 text-indigo-300">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">③ 客观等待周期</span>
            </div>
          </div>
        </div>

        {/* Lawyer Quote Tool (if in Lawyer Mode) */}
        {activeMode === 'lawyer' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <LawyerQuoteCard analysis={analysis} />
          </div>
        )}

        {/* The 6-Step Configurator (Apple/E-commerce Style) */}
        <CaseConfigurator input={caseInput} onChange={handleInputChange} />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Bottom Bar (Always Visible at Bottom) */}
      <ConfiguratorBottomBar
        analysis={analysis}
        onOpenDetails={() => setShowDetailDrawer(false ? false : true)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Detailed Breakdown Drawer / Modal */}
      {showDetailDrawer && (
        <ConfigDetailDrawer
          analysis={analysis}
          onClose={() => setShowDetailDrawer(false)}
          onOpenReport={() => {
            setShowDetailDrawer(false);
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
