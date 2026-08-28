import React from 'react';
import type { FullCaseAnalysis } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface QuickResultHeroProps {
  analysis: FullCaseAnalysis;
  onOpenReport: () => void;
}

export const QuickResultHero: React.FC<QuickResultHeroProps> = ({ analysis, onOpenReport }) => {
  const { financial, timeAndEffort, roi, input } = analysis;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden space-y-5">
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 -translate-x-10 translate-y-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-indigo-800/50 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-blue-200">
            {input.isPropertyCase
              ? `争议标的 ¥${input.claimAmount.toLocaleString()} 元 · 费用测算结果`
              : '非财产争议案件 · 费用测算结果'}
          </span>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center space-x-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/15 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>导出PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="text-[11px] text-slate-300 font-medium">前期启动需预付</div>
          <div className="text-xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            ¥ {financial.upfrontCostMin.toLocaleString()}
            <span className="text-xs font-normal text-slate-300 ml-1 sm:inline block sm:ml-1">
              ~ {financial.upfrontCostMax.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">包含诉讼费+律师费+保全</div>
        </div>

        <div className="bg-emerald-500/15 backdrop-blur-md rounded-2xl p-4 border border-emerald-400/30">
          <div className="text-[11px] text-emerald-300 font-medium flex items-center justify-between">
            <span>胜诉终局净自担</span>
            <span className="text-[9px] bg-emerald-400/20 text-emerald-200 px-1.5 py-0.5 rounded">退费后</span>
          </div>
          <div className="text-xl sm:text-3xl font-black text-emerald-300 mt-1 tracking-tight">
            ¥ {financial.finalNetCostMin.toLocaleString()}
            <span className="text-xs font-normal text-emerald-200/80 ml-1 sm:inline block sm:ml-1">
              ~ {financial.finalNetCostMax.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-emerald-200/70 mt-1 truncate">
            {financial.canTransferLawyerFee ? '✨ 诉讼与律师费对方承担' : '诉讼费全额返还，仅担律师费'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] text-indigo-300 flex items-center justify-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>预计审限周期</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white mt-1">
            {timeAndEffort.calendarMonthsMin} ~ {timeAndEffort.calendarMonthsMax} 个月
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] text-indigo-300 flex items-center justify-center space-x-1">
            <Briefcase className="w-3 h-3" />
            <span>当事人仅需</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-1">
            ~{timeAndEffort.clientHoursWithLawyer} 小时工时
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
          <div className="text-[10px] text-indigo-300 flex items-center justify-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>预估胜诉率</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white mt-1">
            {Math.round(roi.winProbability * 100)}%
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/30 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-100">{roi.recommendationTitle}</span>
        </div>
        <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
          得分 {roi.roiScore}
        </span>
      </div>
    </div>
  );
};
