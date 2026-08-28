import { useState, useMemo } from 'react';
import type { CaseInputState } from './types';
import { runFullCaseAnalysis } from './utils/decisionEngine';
import { Header } from './components/Header';
import { CaseInputSection } from './components/CaseInputSection';
import { FinancialSummaryCard } from './components/FinancialSummaryCard';
import { TimeAndEffortCard } from './components/TimeAndEffortCard';
import { LawyerWorkloadCard } from './components/LawyerWorkloadCard';
import { RoiDecisionCard } from './components/RoiDecisionCard';
import { LawyerQuoteCard } from './components/LawyerQuoteCard';
import { ReportModal } from './components/ReportModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';

export function App() {
  const [activeMode, setActiveMode] = useState<'client' | 'lawyer'>('client');
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
    <div className="min-h-screen bg-slate-100/70 flex flex-col selection:bg-blue-500 selection:text-white">
      <Header
        currentRegionId={caseInput.regionId}
        onRegionChange={(id) => handleInputChange({ regionId: id })}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onOpenReport={() => setShowReportModal(true)}
        onScrollToFaq={scrollToFaq}
      />

      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>不仅算律师费 · 更是诉讼全生命周期决策沙盘</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            打官司要花多少钱？需要多久？值不值得打？
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            全面量化<strong>金钱总成本、日历等待周期、当事人自身工时、律师专业交付清单与胜诉回款率</strong>，让维权决策明明白白。
          </p>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-blue-200">前期启动垫付</div>
              <div className="text-base sm:text-lg font-black text-white">
                ¥ {analysis.financial.upfrontCostMin.toLocaleString()} ~ {analysis.financial.upfrontCostMax.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-emerald-300">胜诉终局净自担</div>
              <div className="text-base sm:text-lg font-black text-emerald-300">
                ¥ {analysis.financial.finalNetCostMin.toLocaleString()} ~ {analysis.financial.finalNetCostMax.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-indigo-200">当事人自身耗时</div>
              <div className="text-base sm:text-lg font-black text-white">
                仅需 ~{analysis.timeAndEffort.clientHoursWithLawyer} 小时
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[11px] text-amber-200">律师专业交付量</div>
              <div className="text-base sm:text-lg font-black text-white">
                约 {analysis.workload.totalHours} 专业工时
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 -mt-6">
        {activeMode === 'lawyer' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <LawyerQuoteCard analysis={analysis} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20">
              <CaseInputSection input={caseInput} onChange={handleInputChange} />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <FinancialSummaryCard financial={analysis.financial} claimAmount={caseInput.claimAmount} />
            <TimeAndEffortCard timeAndEffort={analysis.timeAndEffort} />
            <LawyerWorkloadCard workload={analysis.workload} lawyerFeeMedian={analysis.financial.lawyerFeeMedian} />
            <RoiDecisionCard roi={analysis.roi} claimAmount={caseInput.claimAmount} />
          </div>
        </div>

        <FaqSection />
      </main>

      <Footer />

      {showReportModal && (
        <ReportModal analysis={analysis} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

export default App;
