import React from 'react';
import type { RoiAssessment } from '../types';
import {
  TrendingUp,
  Target,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface RoiDecisionCardProps {
  roi: RoiAssessment;
  claimAmount: number;
}

export const RoiDecisionCard: React.FC<RoiDecisionCardProps> = ({ roi, claimAmount }) => {
  const getBadgeStyle = (level: string) => {
    if (level === 'strongly_recommended') {
      return {
        bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
        badge: 'bg-emerald-600 text-white',
        icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
      };
    }
    if (level === 'recommended') {
      return {
        bg: 'bg-blue-50 border-blue-300 text-blue-950',
        badge: 'bg-blue-600 text-white',
        icon: <TrendingUp className="w-5 h-5 text-blue-600 shrink-0" />,
      };
    }
    if (level === 'cautious') {
      return {
        bg: 'bg-rose-50 border-rose-300 text-rose-950',
        badge: 'bg-rose-600 text-white',
        icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
      };
    }
    return {
      bg: 'bg-amber-50 border-amber-300 text-amber-950',
      badge: 'bg-amber-600 text-white',
      icon: <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    };
  };

  const style = getBadgeStyle(roi.recommendation);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              胜诉率与 ROI 回款决策沙盘
            </h2>
            <p className="text-xs text-slate-500">
              法律胜诉 ≠ 拿到现金，综合评估「胜诉概率」与「执行到位率」的期望净收益
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-slate-500">综合决策指数:</span>
          <span className="text-sm font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
            {roi.roiScore} / 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>法律胜诉概率评级</span>
            </span>
            <span className="text-lg font-black text-blue-600">
              {Math.round(roi.winProbability * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                roi.winProbability >= 0.8
                  ? 'bg-emerald-500'
                  : roi.winProbability >= 0.6
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${roi.winProbability * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            依据核心直接书证（借条/合同/转账记录）完整度与法定诉讼时效规则评估。
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              <span>实际执行到位率 (防老赖风险)</span>
            </span>
            <span className="text-lg font-black text-indigo-600">
              {Math.round(roi.recoveryProbability * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                roi.recoveryProbability >= 0.8
                  ? 'bg-emerald-500'
                  : roi.recoveryProbability >= 0.5
                  ? 'bg-indigo-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${roi.recoveryProbability * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            判决胜诉后对方能否执行到现金。若对方名下无资产，需及早申请诉讼财产保全。
          </p>
        </div>
      </div>

      {claimAmount > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-purple-900">
              数学期望净收益 (Expected Net Return)
            </div>
            <div className="text-[11px] text-purple-700/80">
              公式：涉案标的额 × 胜诉率({Math.round(roi.winProbability * 100)}%) × 执行率({Math.round(roi.recoveryProbability * 100)}%) - 终局自担成本
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-purple-900">
              ¥ {Math.max(0, roi.expectedNetReturnMin).toLocaleString()} ~ {Math.max(0, roi.expectedNetReturnMax).toLocaleString()}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold">综合预期净结余</span>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl border ${style.bg} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {style.icon}
            <span className="font-bold text-sm sm:text-base">{roi.recommendationTitle}</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.badge}`}>
            行动指南
          </span>
        </div>

        <ul className="space-y-2 text-xs leading-relaxed">
          {roi.recommendationDetails.map((detail, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-slate-400 font-bold">•</span>
              <span dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
