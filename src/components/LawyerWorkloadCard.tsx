import React, { useState } from 'react';
import type { LawyerWorkloadBreakdown } from '../types';
import {
  Briefcase,
  CheckSquare2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock3,
  Layers,
} from 'lucide-react';

interface LawyerWorkloadCardProps {
  workload: LawyerWorkloadBreakdown;
  lawyerFeeMedian: number;
}

export const LawyerWorkloadCard: React.FC<LawyerWorkloadCardProps> = ({
  workload,
  lawyerFeeMedian,
}) => {
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    pre_trial: true,
    filing_preservation: true,
    court_hearing: true,
    post_trial: true,
  });

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const hourlyImplied = Math.round(lawyerFeeMedian / (workload.totalHours || 30));

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">律师工作量与专业服务清单</h2>
            <p className="text-xs text-slate-500">
              拆解幕后“黑盒”，清晰展示全案 4 大阶段共 {workload.stages.reduce((acc, s) => acc + s.items.length, 0)} 项具体专业交付动作
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-amber-50 border border-amber-200/80 text-amber-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5">
            <Clock3 className="w-3.5 h-3.5 text-amber-600" />
            <span>预估专业工时：约 {workload.totalHours} 小时</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-amber-950">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            折算律师专业劳动单价：<strong>约 ¥{hourlyImplied.toLocaleString()} 元/工时</strong>。律师不仅是出庭发言，70% 以上的有效劳动在庭前缜密研判与证据攻防中完成。
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {workload.stages.map((stage) => {
          const isExpanded = !!expandedStages[stage.stageId];
          return (
            <div
              key={stage.stageId}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleStage(stage.stageId)}
                className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs sm:text-sm text-slate-800">
                    {stage.stageTitle}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold">
                    {stage.stageHours} 工时
                  </span>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5">
                  {stage.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-2 hover:bg-slate-100/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <CheckSquare2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-xs text-slate-800">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-5.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 shrink-0 self-end sm:self-auto bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                        ~{item.hours} h
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
