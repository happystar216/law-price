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
import { Sparkles, SlidersHorizontal } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-100/80 flex flex-col selection:bg-blue-500 selection:text-white pb-24 sm:pb-28">
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
        {/* Intro Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>诉讼全要素智能选配器</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight">
              调整上方诉讼条件 · 底部实时演算最终成本与策略
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-1 text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-4 h-4" />
            <span>实时测算中</span>
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
        onOpenDetails={() => setShowDetailDrawer(true)}
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
