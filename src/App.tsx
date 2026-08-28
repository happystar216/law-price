import { useState, useMemo } from 'react';
import type { CaseInputState } from './types';
import { runFullCaseAnalysis } from './utils/decisionEngine';
import { Header } from './components/Header';
import { QuickResultHero } from './components/QuickResultHero';
import { CaseInputSection } from './components/CaseInputSection';
import { FinancialSummaryCard } from './components/FinancialSummaryCard';
import { TimeAndEffortCard } from './components/TimeAndEffortCard';
import { LawyerWorkloadCard } from './components/LawyerWorkloadCard';
import { RoiDecisionCard } from './components/RoiDecisionCard';
import { LawyerQuoteCard } from './components/LawyerQuoteCard';
import { ReportModal } from './components/ReportModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { MobileStickyBottomBar } from './components/MobileStickyBottomBar';

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
    <div className="min-h-screen bg-slate-100/80 flex flex-col selection:bg-blue-500 selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        currentRegionId={caseInput.regionId}
        onRegionChange={(id) => handleInputChange({ regionId: id })}
        activeMode={activeMode}
        onModeChange={setActiveMode}
        onOpenReport={() => setShowReportModal(true)}
        onScrollToFaq={scrollToFaq}
      />

      {/* Main Single Column Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* 1. 顶部置顶一眼看懂的报价与结论看板 */}
        <QuickResultHero
          analysis={analysis}
          onOpenReport={() => setShowReportModal(true)}
        />

        {/* 律师报价模式卡片 (若激活) */}
        {activeMode === 'lawyer' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <LawyerQuoteCard analysis={analysis} />
          </div>
        )}

        {/* 2. 案情与诉讼参数输入卡片 (修改各项让测算更精准) */}
        <CaseInputSection input={caseInput} onChange={handleInputChange} />

        {/* 3. 全景金钱账本明细卡片 */}
        <FinancialSummaryCard financial={analysis.financial} claimAmount={caseInput.claimAmount} />

        {/* 4. 双维度时间与精力分析卡片 */}
        <TimeAndEffortCard timeAndEffort={analysis.timeAndEffort} />

        {/* 5. 律师工作量清单与工时拆解卡片 */}
        <LawyerWorkloadCard workload={analysis.workload} lawyerFeeMedian={analysis.financial.lawyerFeeMedian} />

        {/* 6. 胜诉率与 ROI 回款决策沙盘卡片 */}
        <RoiDecisionCard roi={analysis.roi} claimAmount={caseInput.claimAmount} />

        {/* 7. 常见问答 FAQ 卡片 */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Bar */}
      <MobileStickyBottomBar
        analysis={analysis}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal analysis={analysis} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

export default App;
