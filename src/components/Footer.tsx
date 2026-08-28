import React from 'react';
import { Scale, ShieldCheck, Cloud } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <Scale className="w-5 h-5 text-blue-400" />
              <span>维权算盘 (LawPrice)</span>
            </div>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              基于司法统计大数据与现行《诉讼费用交纳办法》打造的专业诉讼全景决策与成本评估系统，让法律维权投入产出更透明。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center space-x-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>数据来源：各省律协参考标准</span>
            </span>
            <span className="flex items-center space-x-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Powered by Cloudflare Pages</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LawPrice. All rights reserved. 仅供诉讼预算与维权决策参考。</p>
          <div className="flex items-center space-x-4">
            <span>隐私保护声明</span>
            <span>•</span>
            <span>合规免责条款</span>
            <span>•</span>
            <span>开放计算引擎</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
