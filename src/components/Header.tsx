import React from 'react';
import { Scale, FileText, HelpCircle } from 'lucide-react';
import { REGIONS } from '../data/regions';

interface HeaderProps {
  currentRegionId: string;
  onRegionChange: (id: string) => void;
  activeMode: 'client' | 'lawyer';
  onModeChange: (mode: 'client' | 'lawyer') => void;
  onOpenReport: () => void;
  onScrollToFaq: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRegionId,
  onRegionChange,
  activeMode,
  onModeChange,
  onOpenReport,
  onScrollToFaq,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">维权算盘</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">LawPrice Pro</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">诉讼全景决策与维权成本智能评估系统</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={currentRegionId}
                onChange={(e) => onRegionChange(e.target.value)}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-medium py-1.5 pl-3 pr-8 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
                aria-label="选择管辖地区"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    📍 {r.shortName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-xs">
                ▼
              </div>
            </div>

            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => onModeChange('client')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'client'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                当事人决策版
              </button>
              <button
                onClick={() => onModeChange('lawyer')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'lawyer'
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                律师快速报价
              </button>
            </div>

            <button
              onClick={onScrollToFaq}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="常见问题答疑"
              aria-label="常见问题"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">生成评估报告</span>
              <span className="sm:hidden">报告</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
