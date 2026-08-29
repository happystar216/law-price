import React from 'react';
import { Scale, PhoneCall, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenMatchLawyer: () => void;
  onScrollToFaq: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMatchLawyer,
  onScrollToFaq,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">维权算盘</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.2 rounded-full bg-blue-100 text-blue-700 font-medium">法务版</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">诉讼成本测算与专业律师匹配系统</p>
            </div>
          </div>

          {/* Controls: FAQ & Match Lawyer */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onScrollToFaq}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="常见问题答疑"
              aria-label="常见问题"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 匹配律师核心动作 */}
            <button
              onClick={onOpenMatchLawyer}
              className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>匹配专业律师</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
