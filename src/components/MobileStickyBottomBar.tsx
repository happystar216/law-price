import React from 'react';
import type { FullCaseAnalysis } from '../types';
import { FileText } from 'lucide-react';

interface MobileStickyBottomBarProps {
  analysis: FullCaseAnalysis;
  onOpenReport: () => void;
}

export const MobileStickyBottomBar: React.FC<MobileStickyBottomBarProps> = ({
  analysis,
  onOpenReport,
}) => {
  const { financial, roi } = analysis;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 text-white shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1">
            <span>预付约 ¥{financial.upfrontCostMin.toLocaleString()}</span>
            <span>·</span>
            <span className="text-emerald-400">胜诉自担 ¥{financial.finalNetCostMin.toLocaleString()}</span>
          </div>
          <div className="text-sm font-black text-white flex items-center space-x-1.5">
            <span>胜诉率 {Math.round(roi.winProbability * 100)}%</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 font-normal">
              {roi.roiScore >= 80 ? '极力推荐' : '建议诉讼'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-transform cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>查看报告</span>
        </button>
      </div>
    </div>
  );
};
