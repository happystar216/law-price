import React, { useState } from 'react';
import type { FullCaseAnalysis } from '../types';
import type { MetricType } from './FiveMetricsBottomBar';
import { FinancialSummaryCard } from './FinancialSummaryCard';
import { TimeAndEffortCard } from './TimeAndEffortCard';
import { LawyerWorkloadCard } from './LawyerWorkloadCard';
import { RoiDecisionCard } from './RoiDecisionCard';
import {
  X,
  Coins,
  UserCheck,
  Calendar,
  TrendingUp,
  Briefcase,
  PhoneCall,
} from 'lucide-react';

interface MetricDetailModalProps {
  initialMetric: MetricType;
  analysis: FullCaseAnalysis;
  onClose: () => void;
  onOpenMatchLawyer: () => void;
}

const TABS: { id: MetricType; label: string; icon: React.ReactNode }[] = [
  { id: 'financial', label: '① 预计总花费', icon: <Coins className="w-3.5 h-3.5" /> },
  { id: 'effort', label: '② 耽误多少时间', icon: <UserCheck className="w-3.5 h-3.5" /> },
  { id: 'timeline', label: '③ 要等多久出结果', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'winrate', label: '④ 胜诉与拿钱把握', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'workload', label: '⑤ 律师干了多少活', icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  initialMetric,
  analysis,
  onClose,
  onOpenMatchLawyer,
}) => {
  const [activeTab, setActiveTab] = useState<MetricType>(initialMetric);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm sm:text-base">5 大核心结果明细与依据</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenMatchLawyer}
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>为您匹配专业律师</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Tabs Selector */}
        <div className="bg-slate-800/90 px-3 py-2 border-b border-slate-700 flex overflow-x-auto gap-1.5 shrink-0 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'financial' && (
            <FinancialSummaryCard
              financial={analysis.financial}
              claimAmount={analysis.input.claimAmount}
            />
          )}

          {activeTab === 'effort' && (
            <TimeAndEffortCard timeAndEffort={analysis.timeAndEffort} />
          )}

          {activeTab === 'timeline' && (
            <TimeAndEffortCard timeAndEffort={analysis.timeAndEffort} />
          )}

          {activeTab === 'winrate' && (
            <RoiDecisionCard roi={analysis.roi} claimAmount={analysis.input.claimAmount} />
          )}

          {activeTab === 'workload' && (
            <LawyerWorkloadCard
              workload={analysis.workload}
              lawyerFeeMedian={analysis.financial.lawyerFeeMedian}
            />
          )}

          {/* Bottom Callout in Modal */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <div className="font-bold text-xs sm:text-sm">想获取本案更精准的起诉方案与律师报价？</div>
              <div className="text-[11px] text-blue-200">免费对接擅长此类案件的资深律师，15分钟内快速响应</div>
            </div>
            <button
              onClick={onOpenMatchLawyer}
              className="flex items-center justify-center space-x-1.5 bg-blue-500 hover:bg-blue-400 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>立即免费匹配律师</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
