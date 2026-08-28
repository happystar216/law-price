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
  FileText,
} from 'lucide-react';

interface MetricDetailModalProps {
  initialMetric: MetricType;
  analysis: FullCaseAnalysis;
  onClose: () => void;
  onOpenReport: () => void;
}

const TABS: { id: MetricType; label: string; icon: React.ReactNode }[] = [
  { id: 'financial', label: '① 金钱花费明细', icon: <Coins className="w-3.5 h-3.5" /> },
  { id: 'effort', label: '② 自己的时间', icon: <UserCheck className="w-3.5 h-3.5" /> },
  { id: 'timeline', label: '③ 案件等待周期', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'winrate', label: '④ 预估胜诉率', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'workload', label: '⑤ 律师工作量', icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  initialMetric,
  analysis,
  onClose,
  onOpenReport,
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
              onClick={onOpenReport}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>生成完整PDF</span>
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
        </div>
      </div>
    </div>
  );
};
