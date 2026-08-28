import React from 'react';
import type { FullCaseAnalysis } from '../types';
import {
  FileText,
  ChevronUp,
  Coins,
  UserCheck,
  Calendar,
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
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* 三大付出核心指标 (金钱付出 + 自身时间精力 + 客观自然周期) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 items-center flex-1">
          {/* 付出 1: 金钱付出 */}
          <div className="space-y-0.5 border-r border-slate-800 pr-2 sm:pr-4">
            <div className="text-[10px] sm:text-xs text-amber-400 font-semibold flex items-center space-x-1">
              <Coins className="w-3 h-3 text-amber-400 shrink-0" />
              <span>① 金钱付出</span>
            </div>
            <div className="text-xs sm:text-base font-black text-white tracking-tight">
              ¥{financial.upfrontCostMin.toLocaleString()}
              <span className="text-[10px] sm:text-xs font-normal text-slate-400 ml-0.5 sm:ml-1">起预付</span>
            </div>
            <div className="text-[9px] sm:text-[11px] text-emerald-400 truncate">
              胜诉自担: ¥{financial.finalNetCostMin.toLocaleString()}
            </div>
          </div>

          {/* 付出 2: 当事人自身时间精力付出 */}
          <div className="space-y-0.5 border-r border-slate-800 pr-2 sm:pr-4">
            <div className="text-[10px] sm:text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>② 自身精力付出</span>
            </div>
            <div className="text-xs sm:text-base font-black text-emerald-300 tracking-tight">
              仅需 ~{timeAndEffort.clientHoursWithLawyer} 小时
            </div>
            <div className="text-[9px] sm:text-[11px] text-slate-400 truncate">
              误工仅 ¥{timeAndEffort.clientLostWageWithLawyer.toLocaleString()} (自己打需{timeAndEffort.clientHoursSelf}h)
            </div>
          </div>

          {/* 付出 3: 客观自然时间周期 */}
          <div className="space-y-0.5">
            <div className="text-[10px] sm:text-xs text-indigo-300 font-semibold flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>③ 客观等待周期</span>
            </div>
            <div className="text-xs sm:text-base font-black text-indigo-200 tracking-tight">
              {timeAndEffort.calendarMonthsMin} ~ {timeAndEffort.calendarMonthsMax} 个月
            </div>
            <div className="text-[9px] sm:text-[11px] text-blue-300 truncate">
              胜诉率 {Math.round(roi.winProbability * 100)}% (正常工作生活)
            </div>
          </div>
        </div>

        {/* 右侧动作按钮 */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 justify-end pt-1 md:pt-0 border-t md:border-t-0 border-slate-800">
          <button
            onClick={onOpenDetails}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white px-3 sm:px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
            <span>明细与工时</span>
            <ChevronUp className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={onOpenReport}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>评估报告</span>
          </button>
        </div>
      </div>
    </div>
  );
};
