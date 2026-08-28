import React from 'react';
import type { FullCaseAnalysis } from '../types';
import { FinancialSummaryCard } from './FinancialSummaryCard';
import { TimeAndEffortCard } from './TimeAndEffortCard';
import { LawyerWorkloadCard } from './LawyerWorkloadCard';
import { RoiDecisionCard } from './RoiDecisionCard';
import { X, Scale, FileText } from 'lucide-react';

interface ConfigDetailDrawerProps {
  analysis: FullCaseAnalysis;
  onClose: () => void;
  onOpenReport: () => void;
}

export const ConfigDetailDrawer: React.FC<ConfigDetailDrawerProps> = ({
  analysis,
  onClose,
  onOpenReport,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200">
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">全生命周期费用与决策配置明细</h3>
              <p className="text-[11px] text-slate-400">诉讼费、工时清单、自然流逝周期与ROI深度拆解</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>生成PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <FinancialSummaryCard financial={analysis.financial} claimAmount={analysis.input.claimAmount} />
          <TimeAndEffortCard timeAndEffort={analysis.timeAndEffort} />
          <LawyerWorkloadCard workload={analysis.workload} lawyerFeeMedian={analysis.financial.lawyerFeeMedian} />
          <RoiDecisionCard roi={analysis.roi} claimAmount={analysis.input.claimAmount} />
        </div>
      </div>
    </div>
  );
};
