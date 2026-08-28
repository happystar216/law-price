import React from 'react';
import type { FullCaseAnalysis } from '../types';
import {
  FileText,
  ChevronUp,
  Clock,
  ListOrdered,
} from 'lucide-react';

interface ConfiguratorBottomBarProps {
  analysis: FullCaseAnalysis;
  onOpenDetails: () => void;
  onOpenReport: () => void;
}

export const ConfiguratorBottomBar: React.FC<ConfiguratorBottomBarProps> = ({
  analysis,
  onOpenDetails,
  onOpenReport,
}) => {
  const { financial, timeAndEffort, roi } = analysis;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 text-white shadow-2xl safe-area-bottom">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400">
              <span>前期预付</span>
              <span className="text-white font-extrabold text-sm sm:text-lg tracking-tight">
                ¥ {financial.upfrontCostMin.toLocaleString()}
                <span className="text-[11px] sm:text-xs font-normal text-slate-400 ml-1">
                  ~ {financial.upfrontCostMax.toLocaleString()}
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] sm:text-xs">
              <span className="text-emerald-400 font-semibold">
                胜诉终局净成本: ¥{financial.finalNetCostMin.toLocaleString()}
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-indigo-300 hidden sm:inline flex items-center space-x-1">
                <Clock className="w-3 h-3 inline" />
                <span>{timeAndEffort.calendarMonthsMin}~{timeAndEffort.calendarMonthsMax}个月</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-blue-300 hidden sm:inline">
                胜诉率 {Math.round(roi.winProbability * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            onClick={onOpenDetails}
            className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">查看费用明细</span>
            <span className="sm:hidden">明细</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>评估报告</span>
          </button>
        </div>
      </div>
    </div>
  );
};
