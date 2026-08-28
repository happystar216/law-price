import React from 'react';
import type { FullCaseAnalysis } from '../types';
import {
  Coins,
  UserCheck,
  Calendar,
  TrendingUp,
  Briefcase,
  FileText,
  ChevronUp,
} from 'lucide-react';

export type MetricType = 'financial' | 'effort' | 'timeline' | 'winrate' | 'workload';

interface FiveMetricsBottomBarProps {
  analysis: FullCaseAnalysis;
  onOpenMetric: (metric: MetricType) => void;
  onOpenReport: () => void;
}

export const FiveMetricsBottomBar: React.FC<FiveMetricsBottomBarProps> = ({
  analysis,
  onOpenMetric,
  onOpenReport,
}) => {
  const { financial, timeAndEffort, roi, workload } = analysis;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-t border-slate-800 text-white shadow-2xl safe-area-bottom">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 space-y-2">
        {/* 顶部通俗提示 */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5 px-1">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">
              实时测算结果（点击下方任意卡片，查看详细怎么算的）：
            </span>
          </div>
          <button
            onClick={onOpenReport}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>导出报告</span>
          </button>
        </div>

        {/* 5 大核心结果卡片（彻底通俗化） */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
          {/* 1. 金钱花费（彻底搞懂：前期垫付 vs 打赢后实际花了多少） */}
          <button
            type="button"
            onClick={() => onOpenMetric('financial')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold">
              <span className="flex items-center space-x-1">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>① 要花多少钱</span>
              </span>
              <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-amber-300 transition-transform" />
            </div>
            <div className="text-xs sm:text-sm font-black text-white mt-1 tracking-tight">
              前期先垫: ¥{financial.upfrontCostMin.toLocaleString()}
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">起</span>
            </div>
            <div className="text-[10px] text-emerald-400 truncate mt-0.5 font-medium">
              {financial.canTransferLawyerFee
                ? '✨ 打赢后对方全包 (净花¥0)'
                : `打赢后实际花销: ¥${financial.finalNetCostMin.toLocaleString()}`}
            </div>
          </button>

          {/* 2. 自己的时间精力 */}
          <button
            type="button"
            onClick={() => onOpenMetric('effort')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold">
              <span className="flex items-center space-x-1">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span>② 耽误多少时间</span>
              </span>
              <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 transition-transform" />
            </div>
            <div className="text-xs sm:text-sm font-black text-emerald-300 mt-1 tracking-tight">
              只需配合 ~{timeAndEffort.clientHoursWithLawyer} 小时
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              不用请假 (自己跑需耗{timeAndEffort.clientHoursSelf}h)
            </div>
          </button>

          {/* 3. 等待时间周期 */}
          <button
            type="button"
            onClick={() => onOpenMetric('timeline')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-indigo-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>③ 要等多久出结果</span>
              </span>
              <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-indigo-300 transition-transform" />
            </div>
            <div className="text-xs sm:text-sm font-black text-indigo-200 mt-1 tracking-tight">
              约 {timeAndEffort.calendarMonthsMin} ~ {timeAndEffort.calendarMonthsMax} 个月
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              法院排期走流程 (正常生活)
            </div>
          </button>

          {/* 4. 预估胜诉率 */}
          <button
            type="button"
            onClick={() => onOpenMetric('winrate')}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-blue-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] text-blue-300 font-bold">
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                <span>④ 胜诉与拿钱把握</span>
              </span>
              <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-blue-300 transition-transform" />
            </div>
            <div className="text-xs sm:text-sm font-black text-blue-200 mt-1 tracking-tight">
              胜诉率 {Math.round(roi.winProbability * 100)}%
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              执行回款率 {Math.round(roi.recoveryProbability * 100)}%
            </div>
          </button>

          {/* 5. 律师具体干什么活 */}
          <button
            type="button"
            onClick={() => onOpenMetric('workload')}
            className="col-span-2 sm:col-span-1 p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-purple-400/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold">
              <span className="flex items-center space-x-1">
                <Briefcase className="w-3 h-3 text-purple-400" />
                <span>⑤ 律师干了多少活</span>
              </span>
              <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-purple-300 transition-transform" />
            </div>
            <div className="text-xs sm:text-sm font-black text-purple-200 mt-1 tracking-tight">
              约 {workload.totalHours} 专业工时
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              4个阶段共13项具体交付
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
