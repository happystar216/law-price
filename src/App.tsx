import { useState, useMemo } from 'react';
import type { CaseInputState } from './types';
import { runFullCaseAnalysis } from './utils/decisionEngine';
import { Header } from './components/Header';
import { UserFriendlyConfigurator } from './components/UserFriendlyConfigurator';
import { FiveMetricsBottomBar, type MetricType } from './components/FiveMetricsBottomBar';
import { MetricDetailModal } from './components/MetricDetailModal';
import { MatchLawyerModal } from './components/MatchLawyerModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, PhoneCall } from 'lucide-react';

export function App() {
  const [activeMetricDetail, setActiveMetricDetail] = useState<MetricType | null>(null);
  const [showMatchLawyerModal, setShowMatchLawyerModal] = useState(false);

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
        onOpenMatchLawyer={() => setShowMatchLawyerModal(true)}
        onScrollToFaq={scrollToFaq}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3.5 sm:px-6 py-5 sm:py-6 space-y-4">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>零法律黑话 · 通俗维权决策演算器</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-indigo-200 bg-white/10 px-2.5 py-1 rounded-xl">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>实时测算中</span>
            </div>
          </div>

          <h1 className="text-base sm:text-xl font-bold tracking-tight">
            根据您自己的实际情况选一选 · 底部实时查看 5 大决策结果
          </h1>
          <p className="text-xs text-slate-300">
            涵盖金钱花费、自身耗时、等待周期、胜诉概率及律师工作量清单（底部任意一项皆可点开看明细）
          </p>
        </div>

        {/* 100% User-Friendly Configurator */}
        <UserFriendlyConfigurator input={caseInput} onChange={handleInputChange} />

        {/* Match Lawyer Banner Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-indigo-700/50">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-blue-300" />
              <span className="font-bold text-sm sm:text-base">需要当地资深律师为您把关案情？</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              免费对接熟悉当地法院裁判尺度的专业律师，15分钟内提供定制化维权方案与精准报价。
            </p>
          </div>
          <button
            onClick={() => setShowMatchLawyerModal(true)}
            className="bg-blue-500 hover:bg-blue-400 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            免费匹配律师
          </button>
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* 5 Metrics Bottom Dock (Always Fixed at Bottom, Clickable) */}
      <FiveMetricsBottomBar
        analysis={analysis}
        onOpenMetric={(metric) => setActiveMetricDetail(metric)}
        onOpenMatchLawyer={() => setShowMatchLawyerModal(true)}
      />

      {/* 5-Tab Detail Modal */}
      {activeMetricDetail && (
        <MetricDetailModal
          initialMetric={activeMetricDetail}
          analysis={analysis}
          onClose={() => setActiveMetricDetail(null)}
          onOpenMatchLawyer={() => {
            setActiveMetricDetail(null);
            setShowMatchLawyerModal(true);
          }}
        />
      )}

      {/* Match Lawyer Lead Modal */}
      {showMatchLawyerModal && (
        <MatchLawyerModal
          analysis={analysis}
          onClose={() => setShowMatchLawyerModal(false)}
        />
      )}
    </div>
  );
}

export default App;
